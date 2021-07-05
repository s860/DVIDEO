pragma solidity ^0.5.0;


//steps :- 1. Model the video, 2. store the video, 3. upload the video, 4. list all the videos


contract DVideo { //contract is a keyword given to dvideo

  uint public videoCount = 0;
  string public name = "DVideo";

  //since solidity is a statically typed programming language so we are writing string,
  //public is written because we can access this name outside the smart contract we will do it in javascript console

  //we haev to actually save that video on blockchain 

//for storing the video we are gonna use mapping ,mapping is another DS which the solidity provides
  //Create id=>struct mapping
  //2. store a video

  mapping(uint => Video) public videos;


//since this mapping is public so it will allow us to fetch the videos by passing the id
//1. Model the video,4. list the videos.
  //Create Struct:- this is used for modeling the video in Solidity


struct Video{
uint id;
string hash;
string title;
address author;
  
}



  //Create Event

  //create an event to allow us to know when the video was uploaded.

  event VideoUploaded(
uint id,
string hash,
string title,
address author
  
);





  constructor() public {
  }

  //3. upload the video


  function uploadVideo(string memory _videoHash, string memory _title) public {

  //we are going to store the video with IPFS hash and that why this function is used




    // Make sure the video hash exists
    // require function does that to check that weather the set of parameters passed are true or not;and acc to that the rest of the function will be //executed.

    require(bytes(_videoHash).length > 0);



    // Make sure video title exists
      require(bytes(_title).length > 0);



    // Make sure uploader address exists
    require(msg.sender != address(0));



    // Increment video id
     videoCount = videoCount + 1;   


    // Add video to the contract
    // to use the real id we use counter cache.

    videos[videoCount] = Video(videoCount, _videoHash, _title, msg.sender);

    //msg.sender is used to get the address of the person who call this function.




    // Trigger an event
    emit VideoUploaded(videoCount, _videoHash, _title, msg.sender);


  }
}
