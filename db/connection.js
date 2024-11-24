import { Sequelize } from "sequelize";

const sequelize = new Sequelize('toughts', 'matos', 'Matos@123', {
    host: '192.168.100.215',
    dialect: "mysql"
});

try {
    sequelize.authenticate();
    console.log('Conexão com o banco de dados MySQL estabelecida com sucesso!');
} catch (error) {
    console.log('Erro ao conectar ao banco de dados MySQL:', error);
}

export default sequelize;
