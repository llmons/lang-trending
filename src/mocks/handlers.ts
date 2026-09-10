import { http, HttpResponse } from 'msw'

export const handlers = [
    http.get('https://api.github.com/search/repositories', () => {
        return HttpResponse.json({
            "total_count": Math.floor(Math.random() * 10_000),
            "incomplete_results": Math.floor(Math.random() * 10_000),
            "items": [],
        })
    }),
]