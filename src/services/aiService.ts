import type { ISSData, NewsArticle, PeopleInSpaceData } from '../types';

const HF_TOKEN = import.meta.env.VITE_AI_TOKEN || '';

// Use HF Router endpoint for better free-tier availability
const MODEL = 'meta-llama/Llama-3.2-1B-Instruct:novita';
const HF_API_URL = 'https://router.huggingface.co/v1/chat/completions';

function buildSystemPrompt(
  issData: ISSData | null,
  articles: NewsArticle[],
  people: PeopleInSpaceData | null
): string {
  const iss = issData
    ? `- Latitude: ${issData.position.lat.toFixed(4)}°
- Longitude: ${issData.position.lng.toFixed(4)}°
- Speed: ${issData.speed.toFixed(0)} km/h
- Nearest Location: ${issData.locationName}
- Positions Tracked: ${issData.trajectory.length}/15`
    : '- ISS data not yet available.';

  const newsSummary =
    articles.length > 0
      ? articles
          .slice(0, 15)
          .map(
            (a, i) =>
              `${i + 1}. [${a.category.toUpperCase()}] "${a.title}" — ${a.source} (${new Date(a.date).toLocaleDateString()})`
          )
          .join('\n')
      : 'No news articles currently loaded in the dashboard.';

  const peopleInSpace =
    people && !people.loading && !people.error
      ? `Total: ${people.number}\nNames: ${people.people.map((p) => `${p.name} (${p.craft})`).join(', ')}`
      : 'Astronaut data not available.';

  return `You are an AI assistant embedded in a Real-Time ISS & News Dashboard. You ONLY answer questions using the data shown below. Do NOT use any outside knowledge. If asked about something not in this data, say: "I can only answer based on the current dashboard data."

=== CURRENT ISS DATA ===
${iss}

=== PEOPLE IN SPACE ===
${peopleInSpace}

=== NEWS ARTICLES LOADED (${articles.length} total) ===
${newsSummary}

Keep answers concise, accurate, and helpful.`;
}

export async function queryAI(
  userMessage: string,
  issData: ISSData | null,
  articles: NewsArticle[],
  people: PeopleInSpaceData | null
): Promise<string> {
  const systemPrompt = buildSystemPrompt(issData, articles, people);

  const response = await fetch(HF_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 350,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AI error ${response.status}: ${body.slice(0, 100)}`);
  }

  const result = await response.json();
  if (result?.choices?.[0]?.message?.content) {
    return result.choices[0].message.content.trim();
  }

  return 'Sorry, I could not generate a response.';
}
