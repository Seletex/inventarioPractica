import mongoose from "mongoose";

export const conectarMongoDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a MongoDB');
    }catch(error){
        console.error('Error al conectar a MongoDB:', error.message);
        throw new Error('Error al conectar a la base de datos');
        process.exit(1);
    }finally{
        mongoose.connection.on('error', (error) => {
            console.error('Error en la conexión a MongoDB:', error.message);
        });
    }
}
    