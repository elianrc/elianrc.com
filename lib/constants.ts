export function whatsappUrl(lang: 'es' | 'en'): string {
  const message =
    lang === 'es'
      ? 'Hola, me gustaría saber más sobre tus servicios.'
      : 'Hi, I would like to know more about your services.'
  return `https://wa.me/17872349341?text=${encodeURIComponent(message)}`
}

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/elianrc',
  github: 'https://github.com/elianrc',
}
