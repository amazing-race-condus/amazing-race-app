export let token: string | null = null

export const setToken = (newToken: string) => {
  token = `Bearer ${newToken}`
}