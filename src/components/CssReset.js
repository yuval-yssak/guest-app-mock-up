import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
 html {
   box-sizing: border-box;
}

 *,
 *::before,
 *::after {
   box-sizing: inherit;
   margin: 0;
   padding: 0;
}

body{
  font-family: Arial, Helvetica, sans-serif;
}
`
