exports.handler = async function(event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Method not allowed. Usa POST dall'app." })
      };
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "OPENAI_API_KEY non configurata su Netlify." })
      };
    }

    let body = {};
    try {
      body = JSON.parse(event.body || "{}");
    } catch (e) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "JSON ricevuto dall'app non valido." })
      };
    }

    const { action, target, items, relations, paths } = body;

    const instructions = `
Sei WebBrain X, un assistente di conoscenza personale.
Rispondi in italiano.
Analizza siti, libri, relazioni, percorsi e cluster.
Devi produrre:
1. riassunto utile
2. collegamenti intelligenti
3. suggerimenti di studio
4. prossimi passi pratici
Non inventare contenuti specifici se non sono presenti nei dati forniti.
`;

    const input = `
AZIONE:
${action || "analisi"}

TARGET:
${JSON.stringify(target || {}, null, 2)}

ITEMS:
${JSON.stringify((items || []).slice(0, 60), null, 2)}

RELAZIONI:
${JSON.stringify((relations || []).slice(0, 60), null, 2)}

PERCORSI:
${JSON.stringify((paths || []).slice(0, 30), null, 2)}
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions,
        input,
        store: false
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: data.error?.message || "Errore OpenAI.",
          raw: data
        })
      };
    }

    const text =
      data.output_text ||
      (data.output || [])
        .map(o => (o.content || []).map(c => c.text || "").join(""))
        .join("\\n") ||
      "Nessuna risposta generata.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message || "Errore interno Function." })
    };
  }
};
