/* global CONFIG, Handlebars, Hooks, Actors, ActorSheet, ChatMessage, Dialog, Items, ItemSheet, Macro, game, ui */

// Import Modules
import { preloadHandlebarsTemplates } from "./templates.js";
import { WerewolfActor } from "./actor/actor.js";

Hooks.once("init", async function () {
  console.log("Initializing Schrecknet...");

  game.settings.register("were", "worldVersion", {
    name: "world Version",
    hint: "Automatically upgrades data when the system.json is upgraded.",
    scope: "world",
    config: true,
    default: "1.0",
    type: String,
  });

  game.were = {
    WerewolfActor,
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d10",
  };

  // Define custom Entity classes
  CONFIG.Actor.documentClass = WerewolfActor;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);

  Actors.registerSheet("were", WerewolfActorSheet, {
    label: "Werewolf Sheet",
    types: ["werewolf", "character"],
    makeDefault: true,
  });
  

  preloadHandlebarsTemplates();

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper("concat", function () {
    let outStr = "";
    for (const arg in arguments) {
      if (typeof arguments[arg] !== "object") {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper("or", function (bool1, bool2) {
    return bool1 || bool2;
  });

  Handlebars.registerHelper("and", function (bool1, bool2) {
    return bool1 && bool2;
  });

  Handlebars.registerHelper("toLowerCase", function (str) {
    return str.toLowerCase();
  });

  Handlebars.registerHelper("toUpperCaseFirstLetter", function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  Handlebars.registerHelper('ge', function( a, b ){
    var next =  arguments[arguments.length-1];
    return (a >= b) ? next.fn(this) : next.inverse(this);
  });
  Handlebars.registerHelper('le', function( a, b ){
    var next =  arguments[arguments.length-1];
    console.log(a,b);
    console.log((a <= b)) 
    return (a <= b) ? next.fn(this) : next.inverse(this);
    
  });
  Handlebars.registerHelper("setVar", function(varName, varValue, options) {
    options.data.root[varName] = varValue;
  });
  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  Handlebars.registerHelper("generateFeatureLabel", function (str) {
    return "were20.".concat(capitalize(str));
  });

  Handlebars.registerHelper("generateSkillLabel", function (str) {
    return "were20.".concat(
      str
        .split(" ")
        .flatMap((word) => capitalize(word))
        .join("")
    );
  });

  // TODO: there exist math helpers for handlebars
  Handlebars.registerHelper(
    "frenzy",
    function (willpowerMax, willpowerAgg, willpowerSup, humanity) {
      return (
        willpowerMax - willpowerAgg - willpowerSup + Math.floor(humanity / 3)
      );
    }
  );

  Handlebars.registerHelper(
    "willpower",
    function (willpowerMax, willpowerAgg, willpowerSup) {
      return willpowerMax - willpowerAgg - willpowerSup;
    }
  );

  // TODO: there exist math helpers for handlebars
  Handlebars.registerHelper("remorse", function (humanity, stain) {
    return 10 - humanity - stain;
  });

  Handlebars.registerHelper("numLoop", function (num, options) {
    let ret = "";

    for (let i = 0, j = num; i < j; i++) {
      ret = ret + options.fn(i);
    }

    return ret;
  });
  Handlebars.registerHelper("minus", function (a, b) {
    return a - b;
  });
  Handlebars.registerHelper("equal", function (a, b, label) {
    return a == b ? label : "";
  });
  Handlebars.registerHelper("getGiftName", function (key, roll = false) {
    const gifts = {

      
    };
    // if (roll) {
    //   // if (key === "rituals") {
    //   //   return disciplines.sorcery;
    //   // } else
    //   if (key === "ceremonies") {
    //     return disciplines.oblivion;
    //   }
    // }
    return disciplines[key];
  });
});



