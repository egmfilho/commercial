/**
 * Created by egmfilho on 14/10/16.
 */

'use strict';

angular.module('commercialApp.services')
  .factory('Parecer', ['$cookies', 'ContatoParecer', 'Usuario', function ($cookies, ContatoParecer, Usuario) {

    function Parecer(parecer) {
      var me = JSON.parse(window.atob($cookies.get('currentUser')));

      this.id = parecer ? parecer.id : '';
      this.atendimentoId = parecer ? parecer.atendimentoId : '';
      this.texto = parecer ? parecer.texto : '';
      this.usuarioId = parecer ? parecer.usuarioId : me.id;
      this.usuario = parecer ? parecer.usuario : new Usuario(me);
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
      parecer.atendimentoId = note.attendance_id;
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
      note.attendance_id = parecer.atendimentoId;
      note.attendance_note_text = parecer.texto;
      note.attendance_note_user_id = parecer.usuarioId;
      note.attendance_note_contact_type_id = parecer.contatoId;
      note.attendance_note_contact_person = parecer.pessoaDeContato;

      return note;
    };

    return Parecer;

  }]);
