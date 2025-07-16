import React, { useState, ChangeEvent } from "react";

interface CsvRow {
  [key: string]: string;
}

export default function CsvUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [rows, setRows] = useState<number>(0);
  const [data, setData] = useState<CsvRow[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setMessage("");
      setData(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Lütfen bir CSV dosyası seçin.");
      return;
    }
    if (!file.name.endsWith(".csv")) {
      setMessage("Yalnızca CSV dosyaları yüklenebilir.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/v1/endpoints/upload-csv/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(`Hata: ${errorData.detail || "Bilinmeyen hata"}`);
      } else {
        const result = await response.json();
        setMessage(result.message);
        setRows(result.rows);

        const getResponse = await fetch("/api/v1/endpoints/upload-csv/");
        if (getResponse.ok) {
          const getData = await getResponse.json();
          setData(getData.data);
        }
      }
    } catch (error) {
      setMessage("Sunucuya bağlanırken hata oluştu.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>CSV Dosyası Yükle</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Yükleniyor..." : "Yükle"}
      </button>
      {message && <p>{message}</p>}

      {data && (
        <>
          <h3>Yüklenen Veriler (Toplam {rows} satır)</h3>
          <table
            border={1}
            cellPadding={5}
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr>
                {Object.keys(data[0]).map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => (
                    <td key={i}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
