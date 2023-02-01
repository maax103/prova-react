import Topbar from "../components/Topbar"
import Container from '@mui/material/Container'
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { Box, Button, Switch } from "@mui/material"
import { ThemeContext } from "../context/ThemeContext"
import { fetchServer, getSellerImagesFromServer } from "../utils/serverUtils"
import { GET_IMAGES_URL } from "../utils/urls"

interface IImages_response {
  message: string;
  buffers?: {}
}

function Home() {
  const authContext = useContext(AuthContext)
  const darkMode = useContext(ThemeContext)
  const [bufferImages, setBufferImages] = useState({})

  useEffect(() => {

    const getImages = async (names: string[], seller: string, amount: number = 1) => {
      const response = await getSellerImagesFromServer(names, seller, amount);
      const data = await response.json();

      setBufferImages(data.buffers);
    }

    getImages(['pc_gamer'], 'max', 2);

  }, [])

  return (
    <>
      <Topbar />
      <Container sx={{ minHeight: 'calc(100vh - 64px)' }}>
        {/* <Box >
          {String(authContext.isAuth)}
          <Button variant="contained" onClick={() => {
            // console.log(authContext)
            authContext.login()
          }}>
            Login
          </Button>
          <Button variant="contained" onClick={() => { authContext.logout() }}>
            Logout
          </Button>
          <Switch inputProps={{ 'aria-label': 'controlled' }} checked={darkMode.isDarkMode} onChange={darkMode.toggleDarkMode} />
        </Box> */}
        {Object.keys(bufferImages).length ?
          Object.keys(bufferImages).map(product_name => {
            console.log(bufferImages)
            return bufferImages[product_name].map((item, index) => {
              return <>
                {/* <button onClick={() => {
                  location.href =
                  'data:application/octet-stream;base64,' + item
                }}>
                  Download
                </button> */}
                <img key={`${product_name}-${index}`} src={`data:image/png;base64,${item}`} />
              </>
            }
            )
          })
          : ''}
      </Container>
    </>
  )
}

export default Home
