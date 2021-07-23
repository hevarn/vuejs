export function textSize (breakpoint) {
  const size = {
    title: 0,
    body: 0
  }
  switch (breakpoint) {
    case 'xs':
      size.title = 1.2
      size.body = 0.5
      break
    case 'sm':
      size.title = 1.2
      size.body = 0.5
      break
    case 'md':
      size.title = 1.2
      size.body = 0.8
      break
    case 'lg':
      size.title = 1.5
      size.body = 0.8
      break
    case 'xl':
      size.title = 1.5
      size.body = 1
      break
    default:
      size.title = 1.5
      size.body = 1.2
      break
  }
  return size
}
