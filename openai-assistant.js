exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "OPENAI_API_KEY non configurata su Netlify." }) };
  }

  let body;
  try { body = JSON.parse(event.body || "{}"); } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "JSON non valido." }) };
  }

  const { action, target, items, relations, paths } = body;

  const instructions = `Sei WebBrain X, assistente di conoscenza personale.
Rispondi in italiano, in modo operativo.
Devi aiutare a:
- riassumere cosa contiene un sito/libro
- spiegare perché è utile
- proporre collegamenti intelligenti
- proporre percorsi di apprendimento
- proporre cluster di conoscenza.
Non inventare contenuti specifici del sito se non sono presenti nei dati forniti.`;

  const input = JSON.stringify({
    action,
    target,
    items: (items || []).slice(0, 80),
    relations: (relations || []).slice(0, 80),
    paths: (paths || []).slice(0, 30)
  }, null, 2);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
        instructions,
        input: `Analizza questi dati WebBrain X e produci suggerimenti utili:\n\n${input}`,
        store: false
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify({ error: data.error?.message || "Errore OpenAI", raw: data }) };
    }

    const text = data.output_text || (data.output || []).map(o => (o.content || []).map(c => c.text || "").join("")).join("\n");
    return { statusCode: 200, body: JSON.stringify({ text, raw: data }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
