declare module 'react-facebook-login-component' {
  interface FacebookLoginProps {
    appId: string
    callback: (response: any) => void
    fields?: string
    render?: (renderProps: any) => JSX.Element
  }

  const FacebookLogin: React.FC<FacebookLoginProps>
  export default FacebookLogin
} 