import { where } from 'sequelize';
import Toughts from '../models/Toughts.js';
import User from '../models/User.js';
import { Op } from 'sequelize';
class ToughtController {
    static async showToughts(req, res) {
        let search = ''; 
        if (req.query.search) {
            search = req.query.search;
        }
        let order = 'DESC';
        if (req.query.order === 'old') {
            order = 'ASC';
        } else {
            order = 'DESC';
        }
        const toughtsData = await Toughts.findAll({
            include: User,
            where: {
                title: { [Op.like]: `%${search}%` }
            },
            order: [['createdAt', order]]
        });
        const toughts = toughtsData.map((result) => result.get({ plain: true }));
        let toughtsQty = toughts.length;
        if (toughtsQty === 0) {
            toughtsQty = false;
        }
        res.render('toughts/home', { toughts, search, toughtsQty });
    }

    static async dashboard(req, res) {
        const userId = req.session.userid;
        const user = await User.findOne({
            where: { 
                id: userId 
            },
            include: Toughts,
            plain: true
        });
        if (!user) {
            res.redirect('/login');
        }
        const toughts = user.Toughts.map((result) => result.dataValues);
        let emptyToughts = false;
        if (toughts.length === 0) {
            emptyToughts = true;
        }
        res.render('toughts/dashboard', { toughts, emptyToughts });
    }

    static createTought(req, res) {
        res.render('toughts/create');
    }

    static async createToughtSave(req, res){
        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        }
        try {
            await Toughts.create(tought);
            req.flash('message', 'Pensamento criado com sucesso!');
            req.session.save(() => {
                res.redirect('/toughts/dashboard'); 
            })
        } catch (error) {
            console.log(error);
        }
    }

    static async removeTought(req, res) {
        const id = req.body.id;
        const UserId = req.session.userid
        try {
            await Toughts.destroy({ where: { id, UserId} });
            req.session.save(() => {
                res.redirect('/toughts/dashboard'); 
            });
        } catch (error) {
            console.log(error); 
        }
    }

    static async updateTouht(req, res) {
        const id = req.params.id;
        const tought = await Toughts.findOne({ where: { id }, raw: true });
        res.render('toughts/edit', { tought }); 
    }

    static async updateTouhtSave(req, res) {
        const id = req.body.id;
        const tought = {
            title: req.body.title
        }
        try {
            await Toughts.update(tought, { where: { id } });
            req.flash('message', 'Pensamento atualizado com sucesso!');
            req.session.save(() => {
                res.redirect('/toughts/dashboard'); 
            });
        } catch (error) {
            console.log(error);
        }
    }
}

export default ToughtController;
