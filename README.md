# Linear logic game
An unfinished linear logic sandbox

See it in action at https://ishanpm.github.io/linearlogicgame

Colorful circles correspond to confusing constructions in a convoluted calculus.

## But what is it?

So you know what [linear logic](https://en.wikipedia.org/wiki/Linear_logic) is? Probably not. But this will teach you! Once I finish making it. (Hopefully...)

The basic idea is that you take regular ol' logic, but you enforce that all inputs are used in a proof exactly once. No more, no less. In addition, the familiar "and" and "or" connectives are split into additive and multiplicative varieties. These capture different aspects of the connectives, and neither quite match up with their classical counterparts. The end result is a system where terms aren't great at representing truth values, but are instead better suited to representing resources or commodities that cannot be freely duplicated.

In this applet, linear logic expressions are represented as nested circles. Each of the four colors correspond to one of the four basic connectives of linear logic. In addition, there are three ornaments, corresponding to negation and the exponentials, that can be placed on the edge of circles to modify them.

## The circles

### Common rules

The four basic connectives, known traditionally as times, par, with, and plus, are all commutative and associative operations. This means that the order of the elements within a circle does not matter. Also, whenever a circle is directly inside of a circle of the same color, it can be popped, moving its content to the enclosing circle. It is also possible to pop a circle containing exactly one element, regardless of the color of the circle it's in, or to surround any circle with another circle of any color.

Every basic operator also has a unit, which can be freely created and destroyed inside that same circle. The units are represented as an empty circle of the same color. There is no technical difference between units and their corresponding operators; the units merely have no sub-elements.

### White - Multiplicative conjunction

Corresponding to the "times" operator, this color is probably the easiest to understand. Things in a white circle are things that you have, and which can be used together. Note that the background of the applet is white - this is no accident. Anything that isn't in a circle is assumed to be in one big multiplicative disjunction with everything else around it.

The unit of "times" is "one", represented as an empty white circle. It represents nothing. It is possible to turn an empty white circle into a black circle containing anything and its dual (more on that later), representing a fair trade.

### Black - Multiplicative disjunction

Corresponding to the "par" operator, this color is probably the hardest to understand. Things in a black circle are things that you have, but they specifically cannot be used with each other. Two black circles can be merged, but only one element from each black circle can actually be used together after that. The rest of the elements of both black circles will be placed in a larger black circle, indicating that they can never be used together.

The unit of "par" is "bottom", represented as an empty black circle. It represents something impossible to have (kind of). Dragging an expression onto an identical expression with a negation ornament, in a white background, will yield an empty black circle.

### Red - Additive disjunction

Corresponding to the "plus" operator, this color represents a choice among a set of possibilities. It is possible to delete anything inside a red circle, thus choosing whatever is left. It is also possible to create duplicate items in a red circle. Like the other types of circle, it is possible to pop a red circle containing exactly one thing.

The unit of "plus" is "zero", represented as an empty red circle. (Noticing a pattern?) This represents anything. Anything can be turned into an empty red circle. Unfortunately due to the ease of creating red circles, they aren't useful for very much. If you are allowed to give one as output, then it functions like a garbage can for unwanted resources.

### Blue - Additive conjunction

Corresponding to the "with" operator, this color represents a possibility of receiving something from among a set. It is possible to create anything within a blue circle, adding ambiguity to an expression. It is also possible to delete duplicates within a blue circle.

The unit of "with" is "top", represented by an empty blue circle. This represents everything. It is possible to transform a blue circle into anything you want by clicking on it, which will create a free-construct zone. This is the reason the default pattern upon opening the page is an empty blue circle.

## Dualism

You may have noticed an odd sort of symmetry between the operators listed above. This is because of a property called dualism. Every expression has a dual. To turn an expression into its dual, swap black with white, and red with blue. The dual carries an important property: If it is possible to transform an expression A into another expression B, then it is possible to transform the dual of B to the dual of A. This is easiest to see with the red and blue circles - where the red circle allows deleting arbitrary expressions, the blue circle allows creating arbitrary expressions - but the same applies to white and black circles as well.

## The ornaments

Ornaments are small shapes that go on the edge of a circle. Their effects apply from left to right, with the rightmost ornament directly applying to the circle. A circle with ornaments can't be popped.

### Black - Negation

This ornament can transform anything to its dual. No transformations are allowed within a circle with a negation ornament, except for transformations involving negation ornaments themselves (as a convenience).

The familiar double negative rule applies here. It is possible to place and remove negative ornaments in pairs.

### Red - Duplicator

This ornament is not yet implemented. It should be able to create copies of its attatched expression within a white circle, as well as the ability to delete it at will.

### Blue - Deleter

This ornament is not yet implemented. It should be able to delete copies of its attached expression within a black circle, as well as the ability to create it with any expression at will.