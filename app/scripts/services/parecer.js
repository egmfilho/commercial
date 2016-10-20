/**
 * Created by egmfilho on 14/10/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('Parecer', ['ContatoParecer', 'Usuario', function (ContatoParecer, Usuario) {

    function Parecer(parecer) {
      this.id = parecer ? parecer.id : '';
      this.texto = parecer ? parecer.texto : '';
      this.usuarioId = parecer ? parecer.usuarioId : '';
      this.usuario = parecer ? parecer.usuario : new Usuario();
      this.contatoId = parecer ? parecer.contatoId : '';
      this.contato = parecer ? parecer.contato : null;
      this.pessoaDeContato = parecer ? parecer.pessoaDeContato : '';
      this.dataCadastro = parecer ? parecer.dataCadastro : new Date();
    }

    Parecer.prototype = {
      setUsuario: function (usuario) {
        this.usuarioId = usuario.id;
        this.usuario = new Usuario(usuario);
      }
    };

    Parecer.converterEmEntrada = function (note) {
      var parecer = {};

      parecer.id = note.attendance_note_id;
      parecer.texto = note.attendance_note_text;
      parecer.usuarioId = note.attendance_note_user_id;
      parecer.usuario = note.attendance_note_maker ? new Usuario(Usuario.converterEmEntrada(note.attendance_note_maker)) : new Usuario();
      parecer.contatoId = note.attendance_note_contact_type_id;
      parecer.contato = note.attendance_note_contact_type ? new ContatoParecer(ContatoParecer.converterEmEntrada(note.attendance_note_contact_type)) : new ContatoParecer();
      parecer.pessoaDeContato = note.attendance_note_person_contact;
      parecer.dataCadastro = new Date(note.attendance_note_date);

      return parecer;
    };

    Parecer.converterEmSaida = function (parecer) {
      var note = {};

      note.attendance_note_id = parecer.id;
      note.attendance_note_text = parecer.texto;
      note.attendance_note_user_id = parecer.usuarioId;
      note.attendance_note_contact_type_id = parecer.contatoId;
      note.attendance_note_contact_person = parecer.pessoaDeContato;

      return note;
    };

    return Parecer;

  }]);
