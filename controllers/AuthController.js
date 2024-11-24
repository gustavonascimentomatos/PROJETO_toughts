import User from '../models/User.js';
import bcrypt from 'bcryptjs';

class AuthController {
    static login(req, res){
        res.render('auth/login');
    }

    static async loginPost(req, res) {
        const { email, password } = req.body;

        // find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            req.flash('message', 'Usuário não encontrado!');
            res.render('auth/login');
            return;
        }

        // chek if passwords match
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            req.flash('message', 'Senha inválida!');
            res.render('auth/login');
            return;   
        }

        req.session.userid = user.id; // initialize session
        req.flash('message', 'Login realizado com sucesso!'); // Exibe mensagem de sucesso!
        req.session.save(() => { res.redirect('/') }); // salvar sessão
    }

    static register(req, res) {
        res.render('auth/register');
    }

    static async registerPost(req, res) {
        const { name, email, password, confirmpassword } = req.body;

        // password match validadion
        if (password != confirmpassword) {
            req.flash('message', 'As senhas não conferem, tente novamente!');
            res.render('auth/register');
            return;
        };

        // check if user exists
        const checkIfUserExists = await User.findOne({ where: { email } });
        if (checkIfUserExists) {
            req.flash('message', 'E-mail já cadastrato, por favor informe um novo e-mail!');
            res.render('auth/register');
            return;
        };

        // create a password
        const salt = bcrypt.genSaltSync(10);
        const hashePassword = bcrypt.hashSync(password, salt);
        const user = {
            name,
            email,
            password: hashePassword
        };
        try {
            const createdUser = await User.create(user); // Cria usuario
            req.session.userid = createdUser.id; // initialize session
            req.flash('message', 'Cadastro realizado com sucesso!'); // Exibe mensagem de sucesso!
            req.session.save(() => { res.redirect('/') }); // salvar sessão
        } catch (error) {
            console.log(error);
        };
    }

    static logout(req, res) {
        req.session.destroy();
        res.redirect('/login')
    }
}

export default AuthController;
 