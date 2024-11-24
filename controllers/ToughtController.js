import Toughts from '../models/Toughts.js';
import User from '../models/User.js';

class ToughtController {
    static async showToughts(req, res) {
        res.render('toughts/home');
    }
}

export default ToughtController;
