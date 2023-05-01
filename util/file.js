const fs = require('fs');

const deleteFile = (filePath) => 
{

    fs.stat(filePath, function (err, stats) {
        // console.log(stats);//here we got all information of file in stats variable
     
        if (err) {
            console.log('file not deleted stat');
            // return console.error(err);
        }else{

            fs.unlink(filePath, (err) => {
                if (err) {
                    // throw (err);
                    console.log('file not deleted unlink');
                }else{
                    console.log('file deleted successfully');
                }
            });

        }
     
        // fs.unlink('./server/upload/my.csv',function(err){
        //      if(err) return console.log(err);
        //      console.log('file deleted successfully');
        // });  
     });

   
}

exports.deleteFile = deleteFile;