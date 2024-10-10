import { useState } from 'react'
import './App.css'
import APIForm from './components/APIForm'
import Gallery from './components/Gallery'

const ACCESS_KEY = //access key

function App() {
  const [inputs, setInputs] = useState({
    url: '',
    format:'',
    no_ads:'',
    no_cookie_banners:'',
    width:'',
    height:'',
  })

  const [img, setImg] = useState(null)
  const [imgStorage, setImgStorage] = useState([])
  const [quota, setQuota] = useState(null)

  const submitForm = () => {
    let defaultValues = {
      format:'jpeg',
      no_ads:'true',
      no_cookie_banners:'true',
      width:'1920',
      height:'1080'
    }
    if(inputs.url == '' || inputs.url == " ") {
      alert("You forgot the url!")
    } else {
      for(const [key, value] of Object.entries(inputs)) {
        if(value == "") {
          inputs[key] = defaultValues[key]
        }
      }
    }

    makeQuery()
  }

  const makeQuery = () => {
    let wait_until = 'network_idle'
    let response_type = 'json'
    let fail_on_status = '400%2C404%2C500-511'
    let url_starter = 'https://'
    let fullURL = url_starter + inputs.url

    let query = `https://api.apiflash.com/v1/urltoimage?access_key=${ACCESS_KEY}&url=${fullURL}&format=${inputs.format}&width=${inputs.width}&height=${inputs.height}&no_cookie_banners=${inputs.no_cookie_banners}&no_ads=${inputs.no_ads}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;
    callAPI(query).catch(console.error)
  }

  const callAPI = async (query) => {
    const response = await fetch(query)
    const json = await response.json()
    if(json.url == null) {
      alert("Something went wrong! Try again")
    } else {
      setImg(json.url)
      setImgStorage((images) => [...images, json.url])
      reset()
      getQuota()
    }
  }  

  const reset = () => {
    setInputs({
      url: '',
      format:'',
      no_ads:'',
      no_cookie_banners:'',
      width:'',
      height:'',
    })
  }

  const getQuota = async () => {
    let query = `https://api.apiflash.com/v1/urltoimage/quota?access_key=${ACCESS_KEY}`
    const response = await fetch(query)
    const json = await response.json()
    setQuota(json)
  }

  return (
    <>
    <div className='whole-page'>
      <h1>Screenshot Builder</h1>

      <APIForm
        inputs={inputs}
        handleChange={(e) => 
          setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value.trim(),
          }
        ))
        }
        onSubmit={submitForm}
        />

        <br></br>

        {
          img ? (
            <img className='screenshot' src={img} alt='Screenshot returned'/>
          ) : (
            <div></div>
          )
        }

          {
            quota ? (
                <div className='quota'>
                  <p>Remaining API calls: {quota.remaining} out of {quota.limit}</p>
                  <p>Time until reset: {quota.reset}</p>
                </div>
            ) : (
              <div className='quota'>
                <p>Make a request for quota information.</p>
                </div>
            )
          }

        <div className='container'>
          <h3>Current Query Status: </h3>
          <p>
            https://api.apiflash.com/v1/urltoimage?access_key=ACCESS_KEY    
            <br></br>
            &url={inputs.url} <br></br>
            &format={inputs.format} <br></br>
            &width={inputs.width}
            <br></br>
            &height={inputs.height}
            <br></br>
            &no_cookie_banners={inputs.no_cookie_banners}
            <br></br>
            &no_ads={inputs.no_ads}
          </p>
        </div>

        <div className='container'>
          <Gallery images={imgStorage} />
        </div>

    </div>
     
    </>
  )
}

export default App
