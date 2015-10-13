'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var cgUtils = require('../utils.js');
var chalk = require('chalk');
var _ = require('underscore');
var fs = require('fs');

_.str = require('underscore.string');
_.mixin(_.str.exports());

var DirectiveGenerator = module.exports = function DirectiveGenerator(args, options, config) {

    cgUtils.getNameArg(this,args);

    yeoman.generators.Base.apply(this, arguments);

};

util.inherits(DirectiveGenerator, yeoman.generators.Base);

DirectiveGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    var prompts = [{
        type:'confirm',
        name: 'needview',
        message: 'Does this directive need an external html file (i.e. view)?',
        default: true
    }];

    cgUtils.addNamePrompt(this,prompts,'directive');

    this.prompt(prompts, function (props) {
        if (props.name){
            this.name = props.name;
        }
        this.needview = props.needview;
        cgUtils.askForModuleAndDir('directive',this,this.needview,cb);
    }.bind(this));

};

DirectiveGenerator.prototype.files = function files() {

    var configName = 'directiveSimpleTemplates';
    var defaultDir = 'templates/simple';
    if (this.needview) {
        configName = 'directiveComplexTemplates';
        defaultDir = 'templates/complex';
        this.className = _.dasherize(this.appname) + '-' + _.dasherize(this.name);
    }

    this.htmlPath = path.join(this.dir,this.name + '.html').replace(/\\/g,'/');;

    cgUtils.processTemplates(this.name,this.dir,'directive',this,defaultDir,configName,this.module);

};