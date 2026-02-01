import OpenAI from 'openai'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const { message } = await req.json()

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Ты эксперт по эссе для поступления в зарубежные вузы. 
Твоя задача — дать честную, конструктивную и подробную обратную связь по эссе студента.
Всегда отвечай на английском.
Структура ответа:
1. Общая оценка (сильные стороны и главные проблемы)
2. Структура и логика
3. Язык, грамматика, стиль
4. Конкретные предложения по улучшению (с примерами фраз)
5. Оценка по шкале 1–10 (с обоснованием)
Будь мотивирующим и поддерживающим.`,
        },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const reply = completion.choices[0].message.content

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Ошибка сервера' }), { status: 500 })
  }
}