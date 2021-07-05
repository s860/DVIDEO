import React, { Component } from 'react';
import DVideo from '../abis/DVideo.json'
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {


  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    //Load accounts
    const accounts = await web3.eth.getAccounts()
    console.log (accounts)
    //Add first account the the state
    this.setState({ account: accounts[0] })
    //Get network ID
        const networkId= await web3.eth.net.getId()
        const networkData = DVideo.networks[networkId]



    //Get network data
    //Check if net data exists, then

    if(networkData){
    const dvideo = new web3.eth.Contract(DVideo.abi, networkData.address)
    this.setState({dvideo})
    const videosCount = await dvideo.methods.videoCount().call()
    this.setState({videosCount})

    //load video according to the newest
    //this is hydrate c application with data 
    //sort by the newest
    //this takes the video from the blockchAIN puts into the app close the video count src the video and putrs them into the blockchain
    for(var i=videosCount;i>=1;i--)
    {
      const video= await dvideo.methods.videos(i).call();
      this.setState({
        video : [...this.state.videos,video]
      })
    }
    //set the latest video along with the title to view as default
    const latest= await dvideo.methods.videos(videosCount).call()
    this.setState({
      currentHash: latest.hash,
      currentTitle: latest.title
    })
    this.setState({loading: false})

//the above code is required to fetch the data from the blockchain.

  }
  else {
    window.alert(`DVideo contract has not been deployed to the detected network `)
    //in the above line we created a copy of the smart contract but we want too change the adress to be dynamic as we connect throough different addresss using metamask

      //Assign dvideo contract to a variable
      //Add dvideo to the state

      //Check videoAmounts
      //Add videAmounts to the state

      //Iterate throught videos and add them to the state (by newest)


      //Set latest video and it's title to view as default 
      //Set loading state to false

      //If network data doesn't exisits, log error
  }
  }

  //Get video
  //this capture file is used to conb=vert the video to buffer
  // and its getting ready to process and put it on IPFS
  //prepare a file to upload on ipfs
    captureFile = event => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }
  //Upload video
  uploadVideo = title => {
     console.log("Submitting file to IPFS...")

    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      //put on blockchain
      console.log('IPFS result', result)
      if(error) {
        console.error(error)
        return
  }

       this.setState({ loading: true })
      this.state.dvideo.methods.uploadVideo(result[0].hash, title).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  //Change Video
  changeVideo = (hash, title) => {
   this.setState({'currentHash': hash});
    this.setState({'currentTitle': title});
  }

  constructor(props) {
    super(props)
    this.state = {
     buffer: null,
     account:'',
     dvideo: null,
     videos:[],
     loading: true,
     currentHash: null,
     currentTitle: null
     // loading: false,
     // account: '',//we can set the default state by this to 0X0 but it will change to meta mask account as we set state account above line 37
      //set states , to use the identicon 0X0 should be removed from the account from the above linee , account should be kept empty
    }

    //Bind functions
     this.uploadVideo = this.uploadVideo.bind(this)
    this.captureFile = this.captureFile.bind(this)
    this.changeVideo = this.changeVideo.bind(this)
  }

//render function that lays out all the code on the page
// it got several main part such as Navbar where Navbar is a component in the components folder.
  render() {
    return (
      <div>
        <Navbar 
          account={this.state.account}
        />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              videos={this.state.videos}
              uploadVideo={this.uploadVideo}
              captureFile={this.captureFile}
              changeVideo={this.changeVideo}
              currentHash={this.state.currentHash}
              currentTitle={this.state.currentTitle}
            />
        }
      </div>
    );
  }
}
export default App;