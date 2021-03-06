/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
		// define this here instead of tiled
		settings.image = "soldier";
		settings.spritewidth = 64;
		settings.spriteheight = 64;
	
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
		
		this.anchorPoint.set(0.5, 1);
		
		// set the default horizontal and vertical speed (accel vector)
		this.body.setVelocity(3, 3);
		
		// set the display to follow our position on both axes
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		
		// ensure the player is updated even when outside of the viewport
		this.alwaysUpdate = true;
		
		this.renderable.addAnimation("walkUp", [0, 1, 2, 3, 4, 5, 6, 7, 8]);
		this.renderable.addAnimation("walkLeft", [9, 10, 11, 12, 13, 14, 15, 16, 17]);
		this.renderable.addAnimation("walkDown", [18, 19, 20, 21, 22, 23, 24, 25, 26]);
		this.renderable.addAnimation("walkRight", [27, 28, 29, 30, 31, 32, 33, 34, 35]);
		
		this.renderable.addAnimation("standUp", [0]);
		this.renderable.addAnimation("standLeft", [9]);
		this.renderable.addAnimation("standDown", [18]);
		this.renderable.addAnimation("standRight", [27]);
		this.renderable.setCurrentAnimation("standDown");
    },

    /**
     * update the entity
     */
	update : function (dt) {
		if (me.input.isKeyPressed('left')) {
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
			// change to the walking animation
			if (!this.renderable.isCurrentAnimation("walkLeft")) {
				this.renderable.setCurrentAnimation("walkLeft");
			}
		} else if (me.input.isKeyPressed('right')) {
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			// change to the walking animation
			if (!this.renderable.isCurrentAnimation("walkRight")) {
				this.renderable.setCurrentAnimation("walkRight");
			}
		} else {
			this.body.vel.x = 0;
		}
		
		if (me.input.isKeyPressed('down')) {
			this.body.vel.y += this.body.accel.y * me.timer.tick;
			// change to the walking animation
			if (this.body.vel.x == 0 && !this.renderable.isCurrentAnimation("walkDown")) {
				this.renderable.setCurrentAnimation("walkDown");
			}
		} else if (me.input.isKeyPressed('up')) {
			this.body.vel.y -= this.body.accel.y * me.timer.tick;
			// change to the walking animation
			if (this.body.vel.x == 0 && !this.renderable.isCurrentAnimation("walkUp")) {
				this.renderable.setCurrentAnimation("walkUp");
			}
		} else {
			this.body.vel.y = 0;
		}
		
		if (this.body.vel.x == 0 && this.body.vel.y == 0) {
			if (this.renderable.isCurrentAnimation("walkUp")) {
				this.renderable.setCurrentAnimation("standUp");
			} else if (this.renderable.isCurrentAnimation("walkLeft")) {
				this.renderable.setCurrentAnimation("standLeft");
			} else if (this.renderable.isCurrentAnimation("walkDown")) {
				this.renderable.setCurrentAnimation("standDown");
			} else if (this.renderable.isCurrentAnimation("walkRight")) {
				this.renderable.setCurrentAnimation("standRight");
			}
		}

		/*if (me.input.isKeyPressed('jump')) {
			// make sure we are not already jumping or falling
			if (!this.body.jumping && !this.body.falling) {
				// set current vel to the maximum defined value
				// gravity will then do the rest
				this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
				this.body.jumping = true;
			}
		}*/
		
        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },
	/**
	* colision handler
	*/
	onCollision : function (response, other) {
		switch (response.b.body.collisionType) {
			case me.collision.types.WORLD_SHAPE:
				// Simulate a platform object
				if (other.type === "platform") {
					if (this.body.falling &&
						!me.input.isKeyPressed('down') &&
						// Shortest overlap would move the player upward
						(response.overlapV.y > 0) &&
						// The velocity is reasonably fast enough to have penetrated to the overlap depth
						(~~this.body.vel.y >= ~~response.overlapV.y)
					) {
						// Disable collision on the x axis
						response.overlapV.x = 0;
						// Repond to the platform (it is solid)
						return true;
					}
					// Do not respond to the platform (pass through)
					return false;
				}
				break;

			case me.collision.types.ENEMY_OBJECT:
				// let's flicker in case we touched an enemy
				this.renderable.flicker(750);
				return false;
				break;

			default:
				// Do not respond to other objects (e.g. coins)
				return false;
		}

		// Make the object solid
		return true;
	}
});

/*----------------
  a Coin entity
 ----------------- */
game.CoinEntity = me.CollectableEntity.extend({
	// extending the init function is not mandatory
	// unless you need to add some extra initialization
	init: function(x, y, settings) {
		settings.image = "spinning_coin_gold";
		
		// call the parent constructor
		this._super(me.CollectableEntity, 'init', [x, y , settings]);

	},

	// this function is called by the engine, when
	// an object is touched by something (here collected)
	onCollision : function (response, other) {
		// do something when collected

		// make sure it cannot be collected "again"
		this.body.setCollisionMask(me.collision.types.NO_OBJECT);

		// remove it
		me.game.world.removeChild(this);

		return false
	}
});

/* --------------------------
an enemy Entity
------------------------ */
game.EnemyEntity = me.Entity.extend({
  init: function(x, y, settings) {
    // define this here instead of tiled
    settings.image = "wheelie_right";
     
    // save the area size defined in Tiled
    var width = settings.width;
    var height = settings.height;
 
    // adjust the size setting information to match the sprite size
    // so that the entity object is created with the right size
    settings.spritewidth = settings.width = 64;
    settings.spritewidth = settings.height = 64;
     
    // call the parent constructor
    this._super(me.Entity, 'init', [x, y , settings]);
     
    // set start/end position based on the initial area size
    x = this.pos.x;
    this.startX = x;
    this.endX   = x + width - settings.spritewidth
    this.pos.x  = x + width - settings.spritewidth;
 
    // manually update the entity bounds as we manually change the position
    this.updateBounds();
 
    // to remember which side we were walking
    this.walkLeft = false;
 
    // walking & jumping speed
    this.body.setVelocity(4, 6);
     
  },
 
  // manage the enemy movement
  update: function(dt) {
 
    if (this.alive) {
      if (this.walkLeft && this.pos.x <= this.startX) {
      this.walkLeft = false;
    } else if (!this.walkLeft && this.pos.x >= this.endX) {
      this.walkLeft = true;
    }
    // make it walk
    this.renderable.flipX(this.walkLeft);
    this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
     
    } else {
      this.body.vel.x = 0;
    }
           
    // update the body movement
    this.body.update(dt);
     
    // handle collisions against other shapes
    me.collision.check(this);
       
    // return true if we moved or if the renderable was updated
    return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },
   
  /**
   * colision handler
   * (called when colliding with other objects)
   */
  onCollision : function (response, other) {
    if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
      // res.y >0 means touched by something on the bottom
      // which mean at top position for this one
      if (this.alive && (response.overlapV.y > 0) && other.body.falling) {
        this.renderable.flicker(700, function() {
			me.game.world.removeChild(this);
		}.bind(this));
		this.body.vel.x = 0;
		this.alive = false;
      }
      return false;
    }
    // Make all other objects solid
    return true;
  }
});
