require("dotenv").config();
const {
  Pool
} = require('pg');
let s = require("../settings");
var dbUrl = s.DATABASE_URL ? s.DATABASE_URL : "postgresql://dullahmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/dullamd";
const proConfig = {
  'connectionString': dbUrl,
  'ssl': {
    'rejectUnauthorized': false
  }
};
const pool = new Pool(proConfig);
async function createAntiwordTable() {
  const _0x3ef954 = await pool.connect();
  try {
    await _0x3ef954.query("\n CREATE TABLE IF NOT EXISTS antiword (\n jid text PRIMARY KEY,\n etat text,\n action text\n );\n ");
    console.log("La table 'antiword' a été créée avec succès.");
  } catch (_0x1f469a) {
    console.error("Une erreur est survenue lors de la création de la table 'antiword':", _0x1f469a);
  } finally {
    _0x3ef954.release();
  }
}
createAntiwordTable();
async function ajouterOuMettreAJourJid(_0x515ce6, _0x523cc7) {
  const _0x1df022 = await pool.connect();
  try {
    const _0x45b0c4 = await _0x1df022.query("SELECT * FROM antiword WHERE jid = $1", [_0x515ce6]);
    const _0x50e950 = _0x45b0c4.rows.length > 0;
    if (_0x50e950) {
      await _0x1df022.query("UPDATE antilien SET etat = $1 WHERE jid = $2", [_0x523cc7, _0x515ce6]);
    } else {
      await _0x1df022.query("INSERT INTO antiword (jid, etat, action) VALUES ($1, $2, $3)", [_0x515ce6, _0x523cc7, "supp"]);
    }
    console.log("JID " + _0x515ce6 + " ajouté ou mis à jour avec succès dans la table 'antiword'.");
  } catch (_0x57c476) {
    console.error("Erreur lors de l'ajout ou de la mise à jour du JID dans la table ,", _0x57c476);
  } finally {
    _0x1df022.release();
  }
}
;
async function mettreAJourAction(_0x41f58b, _0x4ef8d8) {
  const _0x126b9d = await pool.connect();
  try {
    const _0x145680 = await _0x126b9d.query("SELECT * FROM antiword WHERE jid = $1", [_0x41f58b]);
    const _0x3b2998 = _0x145680.rows.length > 0;
    if (_0x3b2998) {
      await _0x126b9d.query("UPDATE antiword SET action = $1 WHERE jid = $2", [_0x4ef8d8, _0x41f58b]);
    } else {
      await _0x126b9d.query("INSERT INTO antiword (jid, etat, action) VALUES ($1, $2, $3)", [_0x41f58b, "non", _0x4ef8d8]);
    }
    console.log("Action mise à jour avec succès pour le JID " + _0x41f58b + " dans la table 'antiword'.");
  } catch (_0x1ad28d) {
    console.error("Erreur lors de la mise à jour de l'action pour le JID dans la table :", _0x1ad28d);
  } finally {
    _0x126b9d.release();
  }
}
;
async function verifierEtatJid(_0x414bdc) {
  const _0x4d1ab5 = await pool.connect();
  try {
    const _0x2a8bd6 = await _0x4d1ab5.query("SELECT etat FROM antiword WHERE jid = $1", [_0x414bdc]);
    if (_0x2a8bd6.rows.length > 0) {
      const _0x4d310a = _0x2a8bd6.rows[0].etat;
      return _0x4d310a === "oui";
    } else {
      return false;
    }
  } catch (_0x44e06c) {
    console.error("Erreur lors de la vérification de l'état du JID dans la table ", _0x44e06c);
    return false;
  } finally {
    _0x4d1ab5.release();
  }
}
;
async function recupererActionJid(_0x199bbf) {
  const _0x555bde = await pool.connect();
  try {
    const _0x4d3f8b = await _0x555bde.query("SELECT action FROM antiword WHERE jid = $1", [_0x199bbf]);
    if (_0x4d3f8b.rows.length > 0) {
      const _0x3cb221 = _0x4d3f8b.rows[0].action;
      return _0x3cb221;
    } else {
      return "supp";
    }
  } catch (_0x36c56a) {
    console.error("Erreur lors de la récupération de l'action du JID dans la table :", _0x36c56a);
    return "supp";
  } finally {
    _0x555bde.release();
  }
}
;
module.exports = {
  'mettreAJourAction': mettreAJourAction,
  'ajouterOuMettreAJourJid': ajouterOuMettreAJourJid,
  'verifierEtatJid': verifierEtatJid,
  'recupererActionJid': recupererActionJid
};