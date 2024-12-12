/* app/api/municipalities/route.ts */

export async function GET() {
    return fetch('https://deisishop.pythonanywhere.com/')
        .then(res => res.json())
        .then(data => Response.json(data))
}