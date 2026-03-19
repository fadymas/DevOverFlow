export async function getData(url: string) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    next: { revalidate: 60 }
  })
  const data = await response.json()
  return data
}
