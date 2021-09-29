const ftp = require("basic-ftp");

const connectionFtp = async() => {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        return await client.access({
            host: process.env.FTPHOST,
            user: process.env.FTPUSER,
            password: process.env.FTPPASSWORD,
            secure: false
        });
    } catch (error) {
        console.log(error);
        throw new Error('Error FTP');
    }
}

module.exports = connectionFtp;