import { MongoClient } from "mongodb";

class DbClient {
    constructor(){
        const queryString = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@${process.env.SERVER_DB}/?retryWrites=true&w=majority&appName=APPointment`;
        this.client = new MongoClient(queryString);
        this.connectDB();
    }

    async connectDB(){
        try {
            await this.client.connect();
            this.db = this.client.db('appointment');
            console.log("Conectado al servidor de DB");
        } catch (error) {
            console.log(error)
        }
    }
}


export default new DbClient;