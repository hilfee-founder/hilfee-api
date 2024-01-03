const express = require('express');
const videoRouter = express.Router();
const multer = require('multer');
const videoModel = require('../../models/videoResume.js');
const https = require('https');
const querystring = require('querystring');
const fs = require("fs");
const { randomUUID } = require("crypto");

// Multer storage configuration for video uploads
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Your existing video upload route
videoRouter.post('/uploads', upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json('no file uploaded.')
        }

        // const newVideo = new videoModel({
        //     title: req.body.title,
        //     media: req.file.filename,

        // })

        // const saveFile = await newVideo.save();
        // console.log(saveFile);


        // After saving the video, initiate SpeechFlow transcription
        initiateSpeechFlowTranscription(req.file.filename);

        res.status(201).json("file uploaded successfully");
    } catch (error) {
        console.log(error, "upload error");
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// New function to initiate SpeechFlow transcription
function initiateSpeechFlowTranscription(filename) {
    // Replace with your actual SpeechFlow API key and secret
    const API_KEY_ID = "bLNqo3XoZzGPcbvY";
    const API_KEY_SECRET = "X1lJega9blfJpQaB";
    const LANG = "en";

    const FILE_PATH = `./uploads/${filename}`; // Update with your server domain

    const RESULT_TYPE = 1;
    const createData = querystring.stringify({
        lang: LANG,
        remotePath: FILE_PATH
    });

    let createRequest;

    if (FILE_PATH.startsWith('http')) {
        console.log('submitting a remote file');
        createRequest = https.request({
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(createData),
                'keyId': API_KEY_ID,
                'keySecret': API_KEY_SECRET
            },
            hostname: 'api.speechflow.io',
            path: '/asr/file/v1/create'
        });
    } else {
        console.log('submitting a local file');
        let formData = '';
        const boundary = randomUUID().replace(/-/g, "");
        formData += "--" + boundary + "\r\n";
        formData += 'Content-Disposition: form-data; name="file"; filename="' + getFileNameByPath(FILE_PATH) + '"\r\n';
        formData += "Content-Type: application/octet-stream\r\n\r\n";
        let formDataBuffer = Buffer.concat([
            Buffer.from(formData, "utf8"),
            fs.readFileSync(FILE_PATH),
            Buffer.from("\r\n--" + boundary + "--\r\n", "utf8"),
        ]);
        createRequest = https.request({
            method: 'POST',
            headers: {
                "Content-Type": `multipart/form-data; boundary=${boundary}`,
                "Content-Length": formDataBuffer.length,
                'keyId': API_KEY_ID,
                'keySecret': API_KEY_SECRET,
            },
            hostname: 'api.speechflow.io',
            path: '/asr/file/v1/create?lang=' + LANG
        });
        createRequest.write(formDataBuffer);
    }

    createRequest.on('response', (createResponse) => {
        let responseData = '';

        createResponse.on('data', (chunk) => {
            responseData += chunk;
        });

        createResponse.on('end', () => {
            let taskId;
            const responseJSON = JSON.parse(responseData);
            console.log(responseJSON)
            if (responseJSON.code == 10000) {
                taskId = responseJSON.taskId;
            } else {
                console.log("create error:");
                console.log(responseJSON.msg);
                return;
            }

            let intervalID = setInterval(() => {
                const queryRequest = https.request({
                    method: 'GET',
                    headers: {
                        'keyId': API_KEY_ID,
                        'keySecret': API_KEY_SECRET
                    },
                    hostname: 'api.speechflow.io',
                    path: '/asr/file/v1/query?taskId=' + taskId + '&resultType=' + RESULT_TYPE
                }, (queryResponse) => {
                    let responseData = '';

                    queryResponse.on('data', (chunk) => {
                        responseData += chunk;
                    });

                    queryResponse.on('end', async () => {
                        const responseJSON = JSON.parse(responseData);
                        if (responseJSON.code === 11000) {
                            console.log('transcription result:');
                            const jsonString = JSON.stringify(responseData);
                            // console.log(jsonString);


                            // parse in text formate

                            const resultObject = JSON.parse(responseData);

                            if (resultObject.code === 11000) {
                                const result = JSON.parse(resultObject.result);
                                const sentences = result.sentences.map(sentence => {
                                    const words = sentence.words.map(word => word.w).join(' ');
                                    return ` ${words}`;
                                    // ${sentence.s}:
                                });

                                const plainTextTranscription = sentences.join('');

                                const newVideo = new videoModel({
                                    media: filename,
                                    transcription: plainTextTranscription

                                })

                                const saveFile = await newVideo.save();
                                console.log(saveFile);
                                // console.log(plainTextTranscription);
                            } else {
                                console.log("Transcription failed. Error message:", resultObject.msg);
                            }

                            // 

                            clearInterval(intervalID);
                        } else if (responseJSON.code == 11001) {
                            console.log('waiting');
                        } else {
                            console.log(responseJSON);
                            console.log("transcription error:");
                            console.log(responseJSON.msg);
                            clearInterval(intervalID);
                        }
                    });
                });

                queryRequest.on('error', (error) => {
                    console.error(error);
                });
                queryRequest.end();
            }, 3000);
        });
    });

    createRequest.on('error', (error) => {
        console.error(error);
    });

    createRequest.write(createData);
    createRequest.end();
}

function getFileNameByPath(path) {
    let index = path.lastIndexOf("/");
    return path.substring(index + 1);
}

// Your existing route to get video files
videoRouter.get('/getFile', async (req, res) => {
    try {
        const getData = await videoModel.find();
        res.status(201).json({ status: 401, getData })
    } catch (error) {
        res.status(401).json({ status: 401, error })
    }
})


videoRouter.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const newData = await videoModel.findByIdAndDelete({ _id: id });
        res.status(200).json(newData);
    } catch (error) {
        res.status(422).json(error);
    }
})


// chatGPT code

const OPENAI_API_KEY = "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"


videoRouter.post('/generate-feedback/:id', async (req, res) => {
    try {
        //  get transcribed text and id both from api

        const transcribeText = req.body.transcription;
        // console.log(transcribeText);
        const { id } = req.params;
        
        // send transcribed text to chat gpt model

        const feedback = await generateFeedback(transcribeText);
        
        // find existing videoModel and save chat gpt text in existing videoModel
        const existingVideoSchema = await videoModel.findById({_id:id})
        // console.log("videoSchema:",  existingVideoSchema);
        existingVideoSchema.feedback = feedback;

        await existingVideoSchema.save();

        res.status(201).json(feedback);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// openai.js
const { OpenAI } = require('openai');

const config = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

const openai = new OpenAI(config);
// console.log(openai)

const generateFeedback = async (prompt) => {
    try {
        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            prompt: prompt,
            max_tokens: 2048,
            temperature: 1,
        });

        console.log('OpenAI API Response:', response);

        if (!response || !response.choices || response.choices.length === 0) {
            console.log('Invalid response from OpenAI API');
        }


        const feedback = response.choices[0].text.trim();
        // console.log('Generated Feedback:', feedback);
        return feedback;
    } catch (error) {
        console.error('API Request Error:', error.message);
        throw error; // Propagate the error
    }
};




module.exports = videoRouter;





// google cloud code

// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const videoModel = require('../model/videoSchema');
// const { SpeechClient } = require('@google-cloud/speech');
// const fs = require('fs');

// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, './uploads');
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// // Initialize Google Cloud Speech-to-Text client
// const speechClient = new SpeechClient({
//     keyFilename: 'C:/acer 2019 Data/New Volume (H)/Job Related Things/Test Assignment For Job/Helfiee video to text app/key1.json',
// });

// router.post('/uploads', upload.single('video'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json('No file uploaded.');
//     }

//     // Call the function to transcribe the uploaded video
//     const transcription = await transcribeVideo(`./uploads/${req.file.filename}`);

//     const newVideo = new videoModel({
//       title: req.body.title,
//       media: req.file.filename,
//       transcription: transcription,
//     });

//     const saveFile = await newVideo.save();
//     console.log(saveFile);

//     res.status(201).json('File uploaded successfully');
//   } catch (error) {
//     console.error(error, 'Upload error');
//     res.status(500).json('Internal Server Error');
//   }
// });

// router.get('/getFile', async (req, res) => {
//   try {
//     const getData = await videoModel.find();
//     res.status(200).json({ status: 200, getData });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: 500, error });
//   }
// });

// // Function to transcribe video using Google Cloud Speech-to-Text
// async function transcribeVideo(filePath) {
//   const [response] = await speechClient.recognize({
//     config: {
//       encoding: 'LINEAR16',
//       sampleRateHertz: 16000,
//       languageCode: 'en-US',
//     },
//     audio: {
//       content: fs.readFileSync(filePath).toString('base64'),
//     },
//   });

//   const transcription = response.results
//     .map((result) => result.alternatives[0].transcript)
//     .join('\n');

//   return transcription;
// }

// module.exports = router;














// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const videoModel = require('../model/videoSchema');

// const storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, './uploads');
//     },
//     filename: function (req, file, callback) {
//         callback(null, (file.originalname));
//     }
// })

// const upload = multer({ storage: storage });

// router.post('/uploads', upload.single('video'), async (req, res) => {

//     try {
//         if (!req.file) {
//             return res.status(400).json({ success: false, error: 'No file uploaded.' });
//         }


//         const newVideo = new videoModel({
//             title: req.body.title,
//             media: req.file.filename,
//         })

//         const saveFile = await newVideo.save();
//         console.log(saveFile);


//         return res.status(201).json({ success: true, message: 'File uploaded successfully' });
//     } catch (error) {
//         console.error('Upload error:', error);
//         return res.status(500).json({ success: false, error: 'Internal Server Error' });
//     }
// })

// router.get('/getFile', async (req, res) => {
//     try {
//         const getData = await videoModel.find();
//         res.status(201).json({ status: 401, getData })

//     } catch (error) {
//         res.status(401).json({ status: 401, error })
//     }
// })



// module.exports = router;








// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const videoModel = require('../model/videoSchema');
// const ffmpeg = require('fluent-ffmpeg');
// const comand = new ffmpeg();
// const fs = require('fs');

// const storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, './uploads');
//     },
//     filename: function (req, file, callback) {
//         callback(null, file.originalname);
//     }
// });

// const upload = multer({ storage: storage });

// router.post('/uploads', upload.single('video'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ success: false, error: 'No file uploaded.' });
//         }

//         const { title } = req.body;

//         // Add validation for title and file type if needed

//         const newVideo = new videoModel({
//             title,
//             media: req.file.filename,
//         });

//         const saveFile = await newVideo.save();
//         console.log(saveFile);

//         // Conversion process
//         const videoPath = req.file.path;
//         console.log(videoPath);
//         const outputPath = `./uploads/${req.file.filename}.mp3`;

//         comand(videoPath)
//             .audioCodec('libmp3lame')  // This line seems to be causing the issue
//             .toFormat('mp3')
//             .on('end', () => {
//                 console.log('Conversion finished');
//                 // You can respond to the client or perform other actions here
//                 res.status(201).json({ success: true, message: 'File uploaded and converted successfully' });
//             })
//             .on('error', (err) => {
//                 console.error('Error:', err);
//                 // Handle errors
//                 res.status(500).json({ success: false, error: 'Conversion error' });
//             })
//             .save(outputPath);

//     } catch (error) {
//         console.error('Upload error:', error);
//         return res.status(500).json({ success: false, error: 'Internal Server Error' });
//     }
// });

// router.get('/getFile', async (req, res) => {
//     try {
//         const getData = await videoModel.find();
//         return res.status(200).json({ success: true, data: getData });
//     } catch (error) {
//         console.error('Get file error:', error);
//         return res.status(500).json({ success: false, error: 'Internal Server Error' });
//     }
// });

// module.exports = router;
