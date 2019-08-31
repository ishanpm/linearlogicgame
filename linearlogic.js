var canvas = $("#canvas")

var ctx = canvas[0].getContext("2d")

var operatorTypes = {
  label: {fill: "white", stroke: "black", basicOperator: true, text: "black", dual: "invlabel"},
  invlabel: {fill: "black", stroke: "white",basicOperator: true, text: "white", dual: "label"},
  free: {fill: "#cfc", stroke: "black", hasChildren: true,  text: "black", dashed: true},
  mirror: {fill: "transparent", stroke: "white", hasChildren: true,  text: "white", dashed: true},
  mulcon: {fill: "white", stroke: "#aaa", hasChildren: true, basicOperator: true, hideStroke: true, text: "black", dual: "muldis"},
  muldis: {fill: "black", stroke: "#555", hasChildren: true,  basicOperator: true, hideStroke: true, text: "white", dual: "mulcon"},
  addcon: {fill: "red", stroke: "#800", hasChildren: true,  basicOperator: true, hideStroke: true, text: "white", dual: "adddis"},
  adddis: {fill: "blue", stroke: "#008", hasChildren: true,  basicOperator: true, hideStroke: true, text: "white", dual: "addcon"},
  neg: {isOrnament: true, fill: "black", stroke: "#555", text: "white", label: "~"},
  posexp: {isOrnament: true, fill: "red", stroke: "#800", text: "white", label: "!", dual: "negexp"},
  negexp: {isOrnament: true, fill: "blue", stroke: "#008", text: "white", label: "?", dual: "posexp"},
}

var oldTypes = [operatorTypes.label, operatorTypes.mulcon, operatorTypes.muldis, operatorTypes.addcon, operatorTypes.adddis, operatorTypes.neg, operatorTypes.posexp, operatorTypes.negexp, operatorTypes.free, operatorTypes.mirror]

function doResize() {
  // Save width and height to ctx for easy access in draw functions
  ctx.width =canvas[0].width=$(window).width()
  ctx.height=canvas[0].height=$(window).height()
  
  root.width = ctx.width;
  root.height = ctx.height;
}
$(window).on("resize",doResize)

ctx.circ = function circ(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2*Math.PI);
}
ctx.strokeCirc = function strokeCirc(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2*Math.PI);
  ctx.stroke();
}
ctx.fillCirc = function fillCirc(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2*Math.PI);
  ctx.fill();
}

class LogicToolbar {
  constructor(root) {
    this.root = root;
    this.cursorx = 0;
    this.icons = [];
    this.iconTypes = [operatorTypes.label, operatorTypes.mulcon, operatorTypes.muldis, operatorTypes.addcon, operatorTypes.adddis, operatorTypes.neg, operatorTypes.posexp, operatorTypes.negexp];
    var iconTypes = this.iconTypes;
    
    // Build icons
    for (var i=0; i<iconTypes.length; i++) {
      this.icons[i] = new LogicOperator(this.root);
      
      if (!iconTypes[i].isOrnament) {
        this.icons[i].type = iconTypes[i];
      } else {
        this.icons[i].type = operatorTypes.mulcon;
        var newOp = new LogicOrnament(this.root);
        newOp.type = iconTypes[i]
        this.icons[i].addOrnament(newOp);
      }
      
      if (iconTypes[i] === operatorTypes.label) {
        this.icons[i].label = "a";
      }
    }
  }
  
  hitTest(x,y) {
    return x < 20*22 && y < 20*2;
  }
  
  onClick(x,y,ctx) {
    x = Math.floor(x/40);
    
    if (x == 0) {
      root.mode = "action";
    } else if (x == 1) {
      root.mode = "pan"
    } else if (x == 2) {
      root.mode = "delete"
    } else if (x == 3 && root.mode == "add" && root.addType == 0) {
      var index = "abcdefghi".indexOf(root.addLabel);
      root.addLabel = "bcdefghia".charAt(index);
    } else {
      root.mode = "add"
      root.addType = x - 3;
      root.addLabel = "a";
    }
  }
  
  tick() {
    var selection = 0;
    if (root.mode == "action") {
      selection = 0;
    } else if (root.mode == "pan") {
      selection = 1;
    } else if (root.mode == "delete") {
      selection = 2;
    } else {
      selection = 3 + root.addType;
    }
    
    this.cursorx += (selection - this.cursorx)/5
    
    // Tick icon operators
    for (var i=0; i<this.icons.length; i++) {
      this.icons[i].tick();
    }
    
    // Update label icon
    if (this.icons[0].label != this.root.addLabel) {
      this.icons[0].label = this.root.addLabel;
      this.icons[0].labelWidth = null;
    }
  }
  
  draw(ctx) {
    ctx.save()
    
    ctx.scale(20,20)
    
    // Frame
    ctx.fillStyle = "white";
    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = "0.1"
    ctx.beginPath();
    ctx.rect(0,0,22,2)
    ctx.fill()
    ctx.stroke()
    
    ctx.beginPath();
    ctx.moveTo(6,.2)
    ctx.lineTo(6,1.8)
    ctx.stroke()
    
    // Draw control icons
    for (var i=0; i<11; i++) {
      this.drawIcon(ctx, i*2, i)
    }
    
    // Selection cursor
    ctx.strokeStyle = "black"
    ctx.beginPath();
    ctx.rect(this.cursorx*2,0,2,2)
    ctx.stroke()
    
    ctx.restore()
  }
  
  drawIcon(ctx, x, i) {
    // Because like who needs images anyway
    if (i == 0) {
      // Cursor
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.moveTo(x+0.6,0.4)
      ctx.lineTo(x+0.6,1.6)
      ctx.lineTo(x+1,1.2)
      ctx.lineTo(x+1.4,1.2)
      ctx.closePath();
      ctx.fill();
      /*
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(x+0.95,1.2)
      ctx.lineTo(x+1.2,1.6)
      ctx.stroke();
      */
    } else if (i == 1) {
      // Pan
      var p = 0.4; // padding
      var d = 0.2; // line distance
      ctx.strokeStyle = "black"
      ctx.beginPath
      ctx.moveTo(x+1-d,p+d)
      ctx.lineTo(x+1  ,p  )
      ctx.lineTo(x+1+d,p+d)
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x+2-p-d,1-d)
      ctx.lineTo(x+2-p  ,1  )
      ctx.lineTo(x+2-p-d,1+d)
      ctx.stroke();
      ctx.moveTo(x+1-d,2-p-d)
      ctx.lineTo(x+1  ,2-p  )
      ctx.lineTo(x+1+d,2-p-d)
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x+p+d,1-d)
      ctx.lineTo(x+p  ,1  )
      ctx.lineTo(x+p+d,1+d)
      ctx.stroke();
    } else if (i == 2) {
      // Delete
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(x+0.4,0.4)
      ctx.lineTo(x+1.6,1.6)
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x+0.4,1.6)
      ctx.lineTo(x+1.6,0.4)
      ctx.stroke();
    } else {
      if (this.icons[i-3]) {
        this.icons[i-3].draw(ctx,x+1,1)
      }
    }
  }
}

// Monadic (only takes one argument) operator
// I wrote this around Christmas so it's called an ornament
class LogicOrnament {
  constructor(root) {
    this.parent = root;
    this.root = root;
    this.x = 0;
    this.y = 0;
    this.r = 0.5;
    this.isOrnament = true;
    // Distance from border of parent, for animations
    this.dist = 0;
    this.th = 0;
    this.i = 0;
    this.type = operatorTypes.neg;
  }
  
  copy(newParent) {
    var result = new LogicOrnament(this.root)
    result.parent = newParent;
    result.x = this.x;
    result.y = this.y;
    result.r = this.r;
    result.dist = this.dist;
    result.th = this.th;
    result.i = this.i;
    result.type = this.type;
    
    return result;
  }
  
  hitTest(x, y) {
    return Math.sqrt(Math.pow(x-this.x,2)+Math.pow(y-this.y,2)) < this.r;
  }
  
  toRelativePos(x, y) {
    if (this.parent == this.root) {
      return [x-this.x, y-this.y];
    }
    var out = this.parent.toRelativePos(x, y)
    out[0] -= this.x;
    out[1] -= this.y;
    return out;
  }
  
  fromRelativePos(x, y) {
    if (this.parent == this.root) {
      return [x+this.x, y+this.y];
    }
    var out = this.parent.fromRelativePos(x, y)
    out[0] += this.x;
    out[1] += this.y;
    return out;
  }
  
  // Returns true if target can be reached by travelling up the hierarchy
  hasAncestor(target) {
    if (target === this)
      return true;
    return this.parent.hasAncestor(target);
  }
  
  // Returns true if any ancestor has a negative ornament, or if in an earlier slot than a negative ornament
  underNegative() {
    var i = this.parent.ornaments.indexOf(this) + 1;
    for (; i<this.parent.ornaments.length; i++) {
      if (this.parent.ornaments[i].type == operatorTypes.neg) {
        return true;
      }
    }
    return this.parent.parent.underNegative();
  }
  
  tick() {
    var tth = this.i/this.parent.r + (this.r * 2)
    this.th += (tth - this.th)* 0.1
    this.th = this.th || 0;
    
    this.dist *= 0.8;
    this.x = Math.cos(this.th) * (this.parent.r + this.dist)
    this.y = -Math.sin(this.th) * (this.parent.r + this.dist)
  }
  
  draw(ctx, ox, oy) {
    ctx.fillStyle = this.type.fill;
    ctx.strokeStyle = this.type.stroke;
    
    ctx.fillCirc(this.x + ox, this.y + oy, this.r)
    ctx.stroke();
    
    var symbol = this.type.label
    if (symbol) {
      ctx.fillStyle = this.type.text;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "0.8px sans-serif"
      ctx.fillText(symbol,this.x + ox,this.y + oy);
    }
  }
}

// Associative and commutative operator
class LogicOperator {
  constructor(root) {
    this.parent = root;
    this.root = root;
    this.children = [];
    this.ornaments = [];
    this.x = 0;
    this.y = 0;
    this.r = 0;
    this.type = operatorTypes.label;
    this.label = null;
    this.isOrnament = false;
    // x and y for next tick
    this.nx = 0;
    this.ny = 0;
    // Distance from center
    this.dist = 0;
  }
  
  copy(newParent) {
    var result = new LogicOperator(this.root)
    result.parent = newParent;
    result.children = this.children.map(e => e.copy(result))
    result.ornaments = this.ornaments.map(e => e.copy(result))
    result.x = this.x;
    result.y = this.y;
    result.r = this.r;
    result.type = this.type;
    result.label = this.label;
    result.labelWidth = null;
    result.nx = this.nx;
    result.ny = this.ny;
    result.dist = this.dist;
    
    return result
  }
  
  renumberOrnaments() {
    for (var i=0; i<this.ornaments.length; i++) {
      this.ornaments[i].i = i;
    }
  }
  
  pushFrom(other) {
    var dx = this.x - other.x
    var dy = this.y - other.y
    
    var dist = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2))
    var over = this.r + other.r + 1 - dist
    if (over>0) {
      var px = dx/dist * over;
      var py = dy/dist * over;
      this.nx += px/4;
      this.ny += py/4;
    }
  }
  
  toRelativePos(x, y) {
    var out = this.parent.toRelativePos(x, y)
    out[0] -= this.x;
    out[1] -= this.y;
    return out;
  }
  
  fromRelativePos(x, y) {
    if (this.parent == this.root) {
      return [x+this.x, y+this.y];
    }
    var out = this.parent.fromRelativePos(x, y)
    out[0] += this.x;
    out[1] += this.y;
    return out;
  }
  
  pushFromEdge(r) {
    var over = this.dist + this.r + 1.05 - r
    if (over > 0 && this.dist) {
      over = Math.log(over+1)
      //this.nx -= this.x/this.dist * over /10
      //this.ny -= this.y/this.dist * over /10
      this.nx /= (over/5 +1)
      this.ny /= (over/5 +1)
    }
  }
  
  hitTest(x, y) {
    if (this.ornaments.length > 0) {
      for (var i=0; i<this.ornaments.length; i++) {
        if (this.ornaments[i].hitTest(x - this.x, y - this.y)){
          return true;
        }
      }
    }
    return Math.sqrt(Math.pow(x-this.x,2)+Math.pow(y-this.y,2)) < this.r;
  }
  
  // Get the element pointed to by x,y
  getElementAt(x, y) {
    // Relative x and y
    var rx = x - this.x;
    var ry = y - this.y;
    
    for (var i=0; i<this.ornaments.length; i++) {
      if (this.ornaments[i].hitTest(rx,ry)) {
        return this.ornaments[i];
      }
    }
    for (var i=0; i<this.children.length; i++) {
      if (this.children[i].hitTest(rx,ry)) {
        return this.children[i].getElementAt(rx, ry);
      }
    }
    
    // No child found; return self
    return this;
  }
  
  // Returns true if target can be reached by travelling up the hierarchy
  hasAncestor(target) {
    if (target === this)
      return true;
    if (this.parent === this.root)
      return (target === this.root);
    //else
    return this.parent.hasAncestor(target);
  }
  
  // Returns true if this or any ancestor has a negative ornament
  underNegative() {
    for (var i=0; i<this.ornaments.length; i++) {
      if (this.ornaments[i].type === operatorTypes.neg) {
        return true;
      }
    }
    
    if (this.parent === this.root)
      return false;
    //else
    return this.parent.underNegative();
  }
  
  // Returns true if this has exactly the same contents as other
  // If neg is true, also requires a difference of exactly one negative
  // ornament in the last slot
  equals(other, neg) {
    // Can't match the base
    if (other === this.root) return false;
    // Can't match ornaments
    if (other.isOrnament) return false;
    if (neg) {
      if (Math.abs(this.ornaments.length-other.ornaments.length)!==1) return false;
    } else {
      if (this.ornaments.length !== other.ornaments.length) return false;
    }
    if (this.children.length !== other.children.length) return false;
    if (this.label != other.label) return false;
    
    // Ornaments must match exactly
    var len = Math.min(this.ornaments.length, other.ornaments.length);
    for (var i=0; i<len; i++) {
      if (this.ornaments[i].type !== other.ornaments[i].type) return false;
    }
    
    if (neg) {
      // Check is last ornament is negative
      if (this.ornaments[len+1] && this.ornaments[len+1].type !== operatorTypes.neg) return false;
      if (other.ornaments[len+1] && other.ornaments[len+1].type !== operatorTypes.neg) return false;
    }
    
    // Children must match in any order
    var unmatched = other.children.map(e=>e);
    
    for (var i=0; i<this.children.length; i++) {
      var matchFound = false;
      
      for (var k=0; k<unmatched.length; k++) {
        if (this.children[i].equals(unmatched[k])) {
          unmatched.splice(k,1);
          matchFound = true;
          break;
        }
      }
      
      if (!matchFound) return false;
    }
    
    return true;
  }
  
  addChild(ch) {
    var pos = ch.fromRelativePos(0,0)
    pos = this.toRelativePos(pos[0], pos[1]);
    ch.x = pos[0];
    ch.y = pos[1];
    ch.nx = ch.x;
    ch.ny = ch.y;
    ch.parent.removeChild(ch)
    ch.parent = this;
    this.children.push(ch);
  }
  
  addOrnament(or,index) {
    var pos = or.fromRelativePos(0,0);
    pos = this.toRelativePos(pos[0], pos[1]);
    or.th = Math.atan2(-pos[1],pos[0])
    
    or.dist = Math.sqrt(pos[0]*pos[0] + pos[1]*pos[1]) - this.r;
    
    if (or.parent !== this.root) or.parent.removeOrnament(or);
    or.parent = this;
    if (index !== undefined) {
      this.ornaments.splice(index,0,or);
    } else {
      this.ornaments.push(or);
    }
    this.renumberOrnaments();
  }
  
  // Removes specified child, if present
  removeChild(ch) {
    var i = this.children.indexOf(ch);
    if (i>-1)
      this.children.splice(i,1);
  }
  
  removeOrnament(or) {
    var i = this.ornaments.indexOf(or);
    if (i>-1) {
      this.ornaments.splice(i,1);
      this.renumberOrnaments();
    }
  }
  
  // Delete this and move all children to the parent
  popOperator() {
    while (this.children.length > 0) {
      this.parent.addChild(this.children[0]);
    }
    this.parent.removeChild(this);
  }
  
  tick() {
    // Calculate pushback for children
    for (var i=0; i<this.children.length; i++) {
      for (var j=0; j<this.children.length; j++) {
        if (i !== j) {
          this.children[i].pushFrom(this.children[j])
        }
      }
    }
    // Tick children
    for (var i=0; i<this.children.length; i++) {
      this.children[i].pushFromEdge(this.r);
      this.children[i].tick();
    }
    // Tick ornaments
    for (var i=0; i<this.ornaments.length; i++) {
      this.ornaments[i].tick();
    }
    
    // Calculate radius
    var newRad = -0.25;
    for (var i=0; i<this.children.length; i++) {
      var candidate = this.children[i].dist + this.children[i].r
      if ( candidate > newRad ) {
        newRad = candidate;
      }
    }
    
    newRad = Math.max(newRad, this.ornaments.length/2 - 1)
    if (this.labelWidth) {
      if (this.ornaments.length > 0) {
        newRad = Math.max(newRad, this.labelWidth/2)
      } else {
        newRad = Math.max(newRad, this.labelWidth/2 - 0.5)
      }
    }
    
    this.r = this.r || 0
    this.r += (newRad + 0.95 - this.r) / 5
    this.x = this.nx;
    this.y = this.ny;
    
    // Update distance
    this.dist = Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))
    
    this.nx = this.x;
    this.ny = this.y;
  }
  
  draw(ctx, ox, oy) {
    ctx.fillStyle = this.type.fill;
    ctx.fillCirc(this.x + ox, this.y + oy, this.r);
    
    if (this.type === this.parent.type || !(this.type.hideStroke) || (this.type === operatorTypes.mulcon && this.parent.type === operatorTypes.free)) {
      ctx.strokeStyle = this.type.stroke
      if (this.type.dashed) {
        ctx.setLineDash([0.5,0.2]);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        ctx.stroke();
      }
    }
    
    if (this.label && this.children.length === 0) {
      ctx.fillStyle = this.type.text;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "1px sans-serif"
      ctx.fillText(this.label,this.x + ox,this.y + oy);
      
      if (this.labelWidth == null) {
        this.labelWidth = ctx.measureText(this.label).width
      }
    }
    
    // Draw children
    for (var i=0; i<this.children.length; i++) {
      this.children[i].draw(ctx, this.x + ox, this.y + oy);
    }
    // Draw ornaments
    for (var i=0; i<this.ornaments.length; i++) {
      this.ornaments[i].draw(ctx, this.x + ox, this.y + oy);
    }
  }
}

class MoveInterpreter {
  constructor(root) {
    this.root = root;
  }
  
  interpretClick(mode, target, x, y, type) {
    var inNegative = (target !== this.root && target.underNegative(this.root))
    
    if (mode == "delete") {
      // Delete
      
      // Can't delete anything under a negative, or the base
      if (inNegative || target === this.root) return true;
      
      if (!target.isOrnament && target.children.length == 1) {
        // Flatten circles with one child
        this.performMove("unwrap", target, null, x, y);
      } else if (!target.isOrnament && target.type === target.parent.type && target.ornaments.length == 0) {
        // Pop circles that match their parents
        this.performMove("pop", target, null, x, y);
      } else if (!target.isOrnament && target.parent.type == operatorTypes.addcon) {
        // Additive conjunction delete
        this.performMove("select", target, null, x, y);
      } else if (target.type == operatorTypes.posexp) {
        // Demote ! exponential
        this.performMove("demote", target, null, x, y);
      } else if (target.type == operatorTypes.negexp) {
        let hasExp = true;
        
        if (target.i == 0) {
          // All children must have ? ornaments and parent must be muldis
          if (target.parent.type == operatorTypes.muldis) {
            for (let c of target.parent.children) {
              if (c.ornaments.length < 1 || c.ornaments[c.ornaments.length-1].type !== operatorTypes.negexp) {
                hasExp = false;
                break;
              }
            }
          } else {
            hasExp = false;
          }
        } else {
          // Next ornament must be ? ornament
          hasExp = (target.parent.ornaments[target.i-1].type == operatorTypes.negexp);
        }
        
        if (hasExp) {
          // Dig ? exponential
          this.performMove("dig", target, null, x, y);
        }
      }
      return true;
    } else if (mode == "add") {
      if (type === operatorTypes.neg) {
        // Double negative
        this.performMove("doublenegate", target, null, x, y);
      } else if (!inNegative) {
        // Can't add anything else under a negative
        if (type === operatorTypes.label) {
          if (target.type.basicOperator && target.type.hasChildren) {
            // Create a unit
            this.performMove("unit", target, null, x, y);
          }
        } else if (type === operatorTypes.posexp) {
          let hasExp = true;
          
          if (!target.isOrnament) {
            // All children must have ! ornaments and target must be mulcon
            if (target.type == operatorTypes.mulcon) {
              for (let c of target.children) {
                if (c.ornaments.length < 1 || c.ornaments[c.ornaments.length-1].type !== operatorTypes.posexp) {
                  hasExp = false;
                  break;
                }
              }
            } else {
              hasExp = false;
            }
          } else {
            // Target must be ! ornament
            hasExp = (target.type == operatorTypes.posexp);
          }
          
          if (hasExp) {
            // Dig ? exponential
            this.performMove("bury", target, null, x, y);
          }
        } else if (type === operatorTypes.negexp) {
          // Promote ? exponential
          this.performMove("promote", target, null, x, y);
        } else if (type.basicOperator) {
          // Wrap the target with addType
          if (target !== this.root) {
            this.performMove("wrap", target, null, x, y, type);
          }
        }
      }
      return true;
    } else {
      return false;
    }
  }
  
  interpretDrag(mode, src, dest, x, y) {
    if (src === dest && src.type === operatorTypes.neg) {
      // Negation ornament click
      // Works under negatives
      this.performMove("negate", src, null, x, y);
    }
    
    if (src === dest && mode == "action") {
      // Click actions
      // None of these work under negatives
      if (src.underNegative()) return false;
      
      if (mode == "action") {
        if (src.type === operatorTypes.mulcon && src.children.length == 0) {
          // Init rule
          this.performMove("split", src, null, x, y);
        } else if (src.type === operatorTypes.muldis && src.children.length == 0) {
          // Create ? rule
          this.performMove("create", src, null, x, y);
        } else if (src.type === operatorTypes.adddis) {
          // Additive disjunction click
          this.performMove("unselect", src, null, x, y);
        } else if (src.type === operatorTypes.posexp) {
          // Destroy ! rule
          this.performMove("destroy", src, null, x, y);
        }
      }
      return true;
    } else if (!src.isOrnament && !dest.isOrnament && mode == "action") {
      // Drag actions
      if (dest.parent == src.parent && dest.type == dest.parent.type && dest.ornaments.length == 0 && !dest.underNegative()) {
        // Associative law
        this.performMove("transpose", src, dest, x, y);
      } else if (src.parent && dest.parent && src.parent.type === operatorTypes.mulcon && dest.parent.type === operatorTypes.muldis && dest.parent.ornaments.length === 0 && src.parent === dest.parent.parent && !dest.parent.underNegative()) {
        // Insert rule (alternative to cut)
        this.performMove("insert", src, dest, x, y);
      } else if (src.parent === dest && !src.isOrnament && !dest.underNegative()) {
        if (dest.type == operatorTypes.addcon) {
          // Additive conjunction copy
          this.performMove("copy", src, dest, x, y);
        } else if (src.parent.type == operatorTypes.mulcon && src.ornaments.length > 0 && src.ornaments[src.ornaments.length-1].type == operatorTypes.posexp) {
          // Additive conjunction copy
          this.performMove("duplicate", src, dest, x, y);
        }
      } else if (src.parent === dest.parent && !src.isOrnament && !dest.isOrnament && !dest.parent.underNegative() && src.equals(dest)) {
        if (src.parent.type === operatorTypes.adddis) {
          // Additive disjunction uncopy
          this.performMove("uncopy", src, dest, x, y);
        } else if (src.parent.type == operatorTypes.muldis && src.ornaments.length > 0 && src.ornaments[src.ornaments.length-1].type == operatorTypes.negexp) {
          // ? exponential unduplicate
          this.performMove("unduplicate", src, dest, x, y);
        }
      } else if (src.equals(dest, true)) {
        if (src.parent.type == operatorTypes.mulcon && src.parent === dest.parent && !src.parent.underNegative()) {
          // Merge rule
          this.performMove("merge", src, dest, x, y);
        }
      }
      return true;
    }
    
    return false;
  }
  
  performMove(move, src, dest, x, y, type) {
    let pos, newOp, newOp2, other, copy, index;
    
    switch (move) {
      case "unit": // Create an empty operator matching src
        newOp = new LogicOperator(this.root);
        newOp.x = x;
        newOp.y = y;
        newOp.type = src.type;
        src.addChild(newOp);
        break;
      case "transpose": // Move src to dest
        dest.addChild(src);
        pos = dest.toRelativePos(x,y)
        src.nx = pos[0];
        src.ny = pos[1];
        break;
      case "pop": // Pop src
        src.popOperator();
        break;
      case "wrap": // Wrap src with type
        index = 0;
        if (src.isOrnament) {
          index = src.parent.ornaments.indexOf(src) + 1;
          src = src.parent;
        }
        
        newOp = new LogicOperator(this.root);
        pos = src.fromRelativePos(0,0)
        newOp.x = pos[0];
        newOp.y = pos[1];
        newOp.type = type;
        newOp.r = src.r;
        src.parent.addChild(newOp);
        newOp.addChild(src);
        
        // Move ornaments to parent
        while (src.ornaments.length > index) {
          newOp.addOrnament(src.ornaments[index]);
        }
        break;
      case "unwrap": // Pop src
        // Move ornaments to child, if present
        while (src.ornaments.length > 0) {
          src.children[0].addOrnament(src.ornaments[0])
        }
        src.popOperator();
        break;
      case "split": // Turn src into muldis, insert a freeAdd and negated mirrorAdd
        // Add a freeAdd zone
        src.type = operatorTypes.muldis;
        newOp = new LogicOperator(this.root);
        newOp.x = x;
        newOp.y = y;
        newOp.type = operatorTypes.free;
        src.addChild(newOp);
        this.root.freeAdd = newOp;
        
        // Will copy to mirrorAdd zone when finished
        newOp = new LogicOperator(this.root);
        newOp.x = x+0.1;
        newOp.y = y+0.1;
        newOp.type = operatorTypes.mirror;
        newOp2 = new LogicOrnament(this.root);
        newOp2.x = x+0.1;
        newOp2.y = y+0.1;
        newOp2.type = operatorTypes.neg;
        src.addChild(newOp);
        newOp.addOrnament(newOp2);
        this.root.mirrorAdd = newOp;
        break;
      case "merge": // Delete src and dest, replace with a muldis unit
        newOp = new LogicOperator(this.root);
        pos = dest.fromRelativePos(0,0);
        newOp.x = pos[0];
        newOp.y = pos[1];
        newOp.type = operatorTypes.muldis;
        newOp.r = dest.r;
        dest.parent.addChild(newOp);
        src.parent.removeChild(src)
        dest.parent.removeChild(dest);
        break;
      case "insert": // Insert src into a mulcon with dest
        newOp = new LogicOperator(this.root);
        pos = dest.fromRelativePos(0,0);
        newOp.x = pos[0];
        newOp.y = pos[1];
        newOp.type = operatorTypes.mulcon;
        dest.parent.addChild(newOp);
        newOp.addChild(src);
        newOp.addChild(dest);
        break;
      case "negate": // Turn src's parent into its dual, distribute to children
        if (src.i == 0) {
          // First slot: dualize operator
          
          src.parent.type = operatorTypes[src.parent.type.dual];
          for (let k=0; k<src.parent.children.length; k++) {
            newOp = new LogicOrnament(this.root);
            newOp.parent = src.parent;
            newOp.x = src.x;
            newOp.y = src.y;
            newOp.type = operatorTypes.neg;
            src.parent.children[k].addOrnament(newOp);
          }
          src.parent.removeOrnament(src);
        } else if (src.parent.ornaments[src.i-1].type == operatorTypes.neg) {
          // Dualize negative (delete double negative)
          src.parent.removeOrnament(src);
          src.parent.removeOrnament(src.parent.ornaments[src.i-1]);
        } else {
          // Dualize ornament
          other = src.parent.ornaments[src.i-1];
          other.type = operatorTypes[other.type.dual]
          src.parent.addOrnament(src,src.i-1)
        }
        break;
      case "doublenegate": // Create two neg ornaments on src
        index = 0;
        if (src.isOrnament) {
          // You can negate ornaments too
          index = src.parent.ornaments.indexOf(src)+1;
          src = src.parent;
        }
        for (let i=0; i<2; i++) {
          newOp = new LogicOrnament(this.root);
          newOp.x = x;
          newOp.y = y;
          newOp.type = operatorTypes.neg;
          src.addOrnament(newOp,index);
        }
        break;
      case "select": // Delete src
        src.parent.removeChild(src);
        break;
      case "unselect": // Create freeAdd in src
        newOp = new LogicOperator(this.root);
        newOp.x = x;
        newOp.y = y;
        newOp.type = operatorTypes.free;
        src.addChild(newOp);
        this.root.freeAdd = newOp;
        break;
      case "copy": // Copy src to dest
        copy = src.copy(dest);
        pos = dest.toRelativePos(x,y);
        copy.x = pos[0];
        copy.y = pos[1];
        dest.addChild(copy);
        break;
      case "uncopy": // Delete src
        src.parent.removeChild(src);
        break;
      case "destroy": // Replace src's parent with mulcon unit
        src.parent.type = operatorTypes.mulcon
        src.parent.label = null;
        index = src.parent.ornaments.length - src.parent.ornaments.indexOf(src) - 1;
        
        while (src.parent.children.length > 0) {
          src.parent.removeChild(src.parent.children[0]);
        }
        while (src.parent.ornaments.length > index) {
          src.parent.removeOrnament(src.parent.ornaments[0]);
        }
        break;
      case "create": // Replace src with freeAdd, add ? ornament
        src.type = operatorTypes.free;
        this.root.freeAdd = src;
        while (src.children.length > 0) {
          src.removeChild(src.children[0]);
        }
        newOp = new LogicOrnament(this.root);
        newOp.parent = src;
        newOp.x = src.x;
        newOp.y = src.y;
        newOp.type = operatorTypes.negexp;
        src.addOrnament(newOp, 0);
        break;
      case "duplicate": // Copy src's parent to dest
        copy = src.copy(dest);
        pos = dest.toRelativePos(x,y);
        copy.x = pos[0];
        copy.y = pos[1];
        dest.addChild(copy);
        break;
      case "unduplicate": // Delete src
        src.parent.removeChild(src)
        break;
      case "demote": // Delete src
        src.parent.removeOrnament(src)
        break;
      case "promote": // Add ? ornament on src
        index = 0;
        if (src.isOrnament) {
          // You can bury ornaments too
          index = src.parent.ornaments.indexOf(src)+1;
          src = src.parent;
        }
        newOp = new LogicOrnament(this.root);
        newOp.parent = src;
        newOp.x = src.x;
        newOp.y = src.y;
        newOp.type = operatorTypes.negexp;
        src.addOrnament(newOp, index);
        break;
      case "bury": // Add ! ornament on src
        index = 0;
        if (src.isOrnament) {
          // You can bury ornaments too
          index = src.parent.ornaments.indexOf(src)+1;
          src = src.parent;
        }
        newOp = new LogicOrnament(this.root);
        newOp.parent = src;
        newOp.x = src.x;
        newOp.y = src.y;
        newOp.type = operatorTypes.posexp;
        src.addOrnament(newOp, index);
        break;
      case "dig": // Delete src
        src.parent.removeOrnament(src)
        break;
    }
  }
}

class LogicBoard {
  constructor() {
    this.children = []
    this.mouseX = 0;
    this.mouseY = 0;
    this.mode = "action";
    this.addType = 1;
    this.addLabel = "a";
    
    this.width = 0;
    this.height = 0;
    
    this.mouseX = 0;
    this.mouseY = 0;
    this.panX = 0;
    this.panY = 0;
    this.scale = 20;
    // freeAdd circle allows free construction inside it
    this.freeAdd = null;
    // freeAdd copies to this circle when finished
    this.mirrorAdd = null;
    // Drag info
    this.inDrag = false;
    this.dragTarget = null;
    this.dragStartX = 0;
    this.dragStartY = 0;
    // The board acts as a multiplicative conjunction operator for most purposes
    this.type = operatorTypes.mulcon;
    
    this.toolbar = new LogicToolbar(this);
    this.moveInterpreter = new MoveInterpreter(this);
    
    this.addChild(new LogicOperator(this));
    this.children[0].type = operatorTypes.adddis;
  }
  
  toScreenPos(x,y) {
    return [(x-this.panX)*this.scale+this.width/2, (y-this.panY)*this.scale+this.height/2]
  }
  
  fromScreenPos(x,y) {
    return [(x-this.width/2)/this.scale+this.panX, (y-this.height/2)/this.scale+this.panY]
  }
  
  toRelativePos(x,y) {
    return [x,y];
  }
  
  fromRelativePos(x,y) {
    return [x,y];
  }
  
  addChild(ch) {
    var pos = ch.fromRelativePos(0,0)
    ch.x = pos[0];
    ch.y = pos[1];
    ch.nx = ch.x;
    ch.ny = ch.y;
    ch.parent.removeChild(ch);
    ch.parent = this;
    this.children.push(ch);
  }
  
  removeChild(ch) {
    var i = this.children.indexOf(ch);
    if (i>-1)
      this.children.splice(i,1);
  }
  
  // Dummy method; ornaments can't be put on the root
  underNegative() {
    return false;
  }
  
  tick() {
    // Pan screen
    if (this.mode == "pan" && this.inDrag) {
      var pos = this.fromScreenPos(this.mouseX, this.mouseY)
      this.panX -= pos[0] - this.dragStartX;
      this.panY -= pos[1] - this.dragStartY;
    }
    
    // Calculate pushback
    for (var i=0; i<this.children.length; i++) {
      for (var j=0; j<this.children.length; j++) {
        if (i !== j) {
          this.children[i].pushFrom(this.children[j])
        }
      }
    }
    // Tick
    for (var i=0; i<this.children.length; i++) {
      this.children[i].tick()
    }
    
    // Tick toolbar
    this.toolbar.tick();
  }
  
  draw(ctx) {
    ctx.save()
    
    ctx.fillStyle = "white"
    ctx.strokeStyle = "black"
    ctx.lineWidth = 0.1;
    ctx.fillRect(0,0,this.width,this.height)
    
    ctx.translate(this.width/2, this.height/2)
    ctx.scale(this.scale,this.scale)
    ctx.translate(-this.panX, -this.panY)
    
    for (var i=0; i<this.children.length; i++) {
      this.children[i].draw(ctx,0,0)
    }
    
    ctx.restore()
    
    this.toolbar.draw(ctx);
  }
  
  onMousedown(x, y, ctx) {
    if (this.toolbar.hitTest(x,y)) {
      this.toolbar.onClick(x,y,ctx)
      return;
    }
    
    var pos = this.fromScreenPos(x,y);
    x = pos[0]
    y = pos[1]
    
    this.dragStartX = x;
    this.dragStartY = y;
    
    if (this.mode == "pan") {
      // Start pan
      this.inDrag = true;
      return;
    }
    
    this.dragTarget = null;
    var target = this;
    
    for (var i=0; i<this.children.length; i++) {
      if (this.children[i].hitTest(x,y)) {
        target = this.children[i].getElementAt(x,y);
        break;
      }
    }
    
    var inFreeAdd = (target !== this && target.hasAncestor(this.freeAdd))
    
    if (this.freeAdd === null) {
      // Click actions
      let handled = this.moveInterpreter.interpretClick(this.mode, target, x, y, oldTypes[this.addType])
      
      if (!handled) {
        // Drag begin
        this.inDrag = true;
        this.dragTarget = target;
      }
    } else if (!inFreeAdd) {
      // Exit free construct mode
      
      var copy;
      if (this.mirrorAdd) {
        copy = this.freeAdd.copy(this);
        var pos = this.mirrorAdd.fromRelativePos(0,0);
        copy.x = pos[0];
        copy.y = pos[1];
        this.mirrorAdd.addChild(copy);
        copy.popOperator();
        if (this.freeAdd.children.length == 0) {
          // No chidren: Empty (imitates pop behavior of freeAdd)
          this.mirrorAdd.type = this.mirrorAdd.parent.type;
        } else if (this.freeAdd.children.length == 1) {
          // One child: Unwrap
          while (this.mirrorAdd.ornaments.length > 0) {
            this.mirrorAdd.children[0].addOrnament(this.mirrorAdd.ornaments[0]);
          }
          this.mirrorAdd.popOperator();
        } else {
          // Multiple children: Default to multiplicative conjunction
          this.mirrorAdd.type = operatorTypes.mulcon;
        }
      }
      
      if (this.freeAdd.children.length == 0) {
        // No children: Pop
        if (this.freeAdd.ornaments.length > 0) {
          this.freeAdd.type = this.freeAdd.parent.type;
        } else {
          this.freeAdd.popOperator();
        }
      } else if (this.freeAdd.children.length == 1) {
        // One child: Unwrap
        while (this.freeAdd.ornaments.length > 0) {
          this.freeAdd.children[0].addOrnament(this.freeAdd.ornaments[0]);
        }
        this.freeAdd.popOperator();
      } else {
        // Multiple children: Default to multiplicative conjunction
        this.freeAdd.type = operatorTypes.mulcon;
      }
      
      this.freeAdd = null;
      this.mirrorAdd = null;
    } else {
      if (target.isOrnament && target.parent == this.freeAdd) return;
      
      if (this.mode == "delete") {
        if (target !== this && target !== this.freeAdd) {
          // Delete
          if (target.isOrnament) {
            target.parent.removeOrnament(target)
          } else {
            target.popOperator();
          }
        }
      } else if (this.mode == "add") {
        if (oldTypes[this.addType].isOrnament) {
          if (target !== this && target !== this.freeAdd) {
            // Create an ornament
            var index = 0;
            if (target.isOrnament) {
              index = target.parent.ornaments.indexOf(target) + 1;
              target = target.parent;
            }
            
            var newOp = new LogicOrnament(this);
            newOp.x = x;
            newOp.y = y;
            newOp.type = oldTypes[this.addType];
            target.addOrnament(newOp,index);
          }
        } else if (oldTypes[this.addType].basicOperator && target.type.hasChildren) {
          // Create an operator
          var newOp = new LogicOperator(this);
          newOp.x = x;
          newOp.y = y;
          newOp.type = oldTypes[this.addType];
          if (this.addType == 0) {
            newOp.label = this.addLabel;
          }
          target.addChild(newOp);
        }
      }
    }
  }
  
  onMouseup(x, y, ctx) {
    this.inDrag = false;
    
    // mouseup actions only apply with a dragTarget
    if (this.dragTarget === null) return;
    
    var pos = this.fromScreenPos(x,y);
    x = pos[0];
    y = pos[1];
    
    var dragTarget = this.dragTarget;
    this.dragTarget = null;
    
    var target = this;
    
    for (var i=0; i<this.children.length; i++) {
      if (this.children[i].hitTest(x,y)) {
        target = this.children[i].getElementAt(x,y);
        break;
      }
    }
    
    this.moveInterpreter.interpretDrag(this.mode, dragTarget, target, x, y);
  }
}

var root = new LogicBoard();

function loop() {
  try {
    root.tick();
    root.draw(ctx);
    requestAnimationFrame(loop)
  } catch (e) {
    requestAnimationFrame(loop)
    throw e;
  }
}

canvas.on("mousemove", function(e) {
  root.mouseX = e.clientX;
  root.mouseY = e.clientY;
})

canvas.on("mousedown", function(e) {
  root.mouseX = e.clientX;
  root.mouseY = e.clientY;
  if (e.shiftKey) {
    var tmpMode = root.mode
    root.mode = "delete"
    root.onMousedown(e.clientX, e.clientY, ctx)
    root.mode = tmpMode;
  } else {
    root.onMousedown(e.clientX, e.clientY, ctx)
  }
})



canvas.on("mouseup", function(e) {
  root.mouseX = e.clientX;
  root.mouseY = e.clientY;
  root.onMouseup(e.clientX, e.clientY, ctx)
})

$(document).on("keydown", function(e) {
  if (e.key == "1") {
    if (root.mode != "add" || root.addType != 0) {
      root.mode = "add";
      root.addType = 0;
      root.addLabel = "a";
    } else {
      var index = "abcdefghi".indexOf(root.addLabel);
      root.addLabel = "bcdefghia".charAt(index);
    }
  } else if (+e.key && +e.key < 9) {
    root.mode = "add"
    root.addType = +e.key - 1
    root.addLabel = "a"
  } else if (e.key == "q") {
    root.mode = "action"
  } else if (e.key == "w" || e.key == " ") {
    root.mode = "pan"
  } else if (e.key == "e") {
    root.mode = "delete"
  }
})

doResize()

loop();