game.resources = [

    /* Graphics.
     * @example
     * {name: "example", type:"image", src: "data/img/example.png"},
     */
	// our level tilesets
	{name: "dirt", type: "image", src: "data/img/map/dirt.png"},
	{name: "grass", type: "image", src: "data/img/map/grass.png"},
	{name: "water", type: "image", src: "data/img/map/water.png"},
	{name: "rock", type: "image", src: "data/img/map/rock.png"},
	{name: "watergrass", type: "image", src: "data/img/map/watergrass.png"},
	
	// main player spritesheet
	{name: "male_walkcycle", type:"image", src: "data/img/sprite/people/male_walkcycle.png"},
	
	// the spinning coin spritesheet
	{name: "spinning_coin_gold",  type:"image", src: "data/img/sprite/spinning_coin_gold.png"},
	
	// our enemty entity
	{name: "wheelie_right",       type:"image", src: "data/img/sprite/monsters/wheelie_right.png"},


    /* Texture Atlases
     * @example
     * {name: "texture", type: "json", src: "data/img/example_tps.json"},
     */

    /* Maps.
     * @example
     * {name: "example01", type: "tmx", src: "data/map/example01.tmx"},
     * {name: "example01", type: "tmx", src: "data/map/example01.json"},
      */
	{name: "map1", type: "tmx", src: "data/map/map1.tmx"}

    /* Background music.
     * @example
     * {name: "example_bgm", type: "audio", src: "data/bgm/"},
     */

    /* Sound effects.
     * @example
     * {name: "example_sfx", type: "audio", src: "data/sfx/"}
     */
];
