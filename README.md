# Linear logic game
An unfinished linear logic sandbox

See it in action at https://ishanpm.github.io/linearlogicgame

Colorful circles correspond to confusing constructions in a convoluted calculus.

## But what is it?

So you know what [linear logic](https://en.wikipedia.org/wiki/Linear_logic) is? Probably not. But this will teach you! Once I finish making it. (Hopefully...)

The basic idea is that you take regular ol' logic, but you remove the ability to duplicate and delete truths at will. In addition, the familiar "and" and "or" connectives are split into additive and multiplicative varieties. These capture different aspects of the connectives, and neither quite match up with their classical counterparts. The end result is a system where terms aren't great at representing truth values, but are instead better suited to representing resources or commodities that cannot be freely duplicated.

In this applet, linear logic expressions are represented as nested circles. Each of the four colors correspond to one of the four basic connectives of linear logic. In addition, there are three ornaments, corresponding to negation and the exponentials, that can be placed on the edge of circles to modify them. 

## The circles

### Common rules

The four basic connectives, known traditionally as times, par, with, and plus, are all commutative and associative operations. This means that the order of the elements within a circle does not matter. Also, whenever a circle is directly inside of a circle of the same color, it can be popped, moving its content to the enclosing circle. It is also possible to pop a circle containing exactly one element, regardless of the color of the circle it's in, or to surround anything with a circle of any color.

Every basic operator also has a unit, which can be freely created and destroyed inside that same circle. The units are represented as an empty circle of the same color. There is no technical difference between units and their corresponding operators; the units merely have no sub-elements.

### White - Multiplicative conjunction

Corresponding to the "times" operator, this color is probably the easiest to understand. Things in a white circle are things that you have, and which can be used together. Note that the background of the applet is white - this is no accident. Anything that isn't in a circle is assumed to be in one big multiplicative disjunction with everything else around it.

The unit of "times" is "one", represented as an empty white circle. It represents nothing. It is possible to turn an empty white circle into a black circle containing anything and its dual (more on that later), representing a fair trade.

### Black - Multiplicative disjunction

Corresponding to the "par" operator, this color is probably the hardest to understand intuitively. Things in a black circle are things that you have, but they cannot be used with each other. Two black circles can be merged, but only one element from each black circle can actually be used together after that. The rest of the elements of both black circles will be placed in a larger black circle, indicating that they can never be used together.

The unit of "par" is "bottom", represented as an empty black circle. It represents something impossible to have (kind of). Dragging an expression onto an identical expression with a negation ornament, in a white background, will yield an empty black circle.

### Red - Additive disjunction

Corresponding to the "plus" operator, this color represents a choice among a set of possibilities. It is possible to delete anything inside a red circle, thus choosing whatever is left. It is also possible to create duplicate items in a red circle. Like the other types of circle, it is possible to pop a red circle containing exactly one thing.

The unit of "plus" is "zero", represented as an empty red circle. This represents something unknown. Anything can be turned into an empty red circle. Unfortunately, due to the ease of creating red circles, they aren't useful for very much. If you are allowed to give one as output, then it functions like a garbage can for unwanted resources.

### Blue - Additive conjunction

Corresponding to the "with" operator, this color represents a possibility of receiving something from among a set. It is possible to create anything within a blue circle, adding ambiguity to an expression. It is also possible to delete duplicates within a blue circle.

The unit of "with" is "top", represented by an empty blue circle. This represents everything. It is possible to transform a blue circle into anything you want by clicking on it, which will create a free-construct zone. This is the reason the default pattern upon opening the page is an empty blue circle.

## Dualism

You may have noticed an odd sort of symmetry between the operators listed above. This is because of a property called dualism. Every expression has a dual. To turn an expression into its dual, swap black with white, and red with blue. The dual carries an important property: If it is possible to transform an expression A into another expression B, then it is possible to transform the dual of B to the dual of A. This is easiest to see with the red and blue circles - where the red circle allows deleting arbitrary expressions, the blue circle allows creating arbitrary expressions - but the same applies to white and black circles as well.

## The ornaments

Ornaments are small shapes that go on the edge of a circle. Their effects apply from left to right, with the rightmost ornament directly applying to the circle. A circle with ornaments can't be popped with the Pop rule, but it can be unwrapped.

### Black - Negation

This ornament can transform anything to its dual. No transformations are allowed within a circle with a negation ornament, except for transformations involving negation ornaments themselves (as a convenience).

The familiar double negative rule applies here. It is possible to place and remove negative ornaments in pairs.

### Red - Duplicator

This ornament can be deleted anywhere (except under a negation ornament), and can be created on a white circle if all of the subexpressions have a red ornament in the outermost slot. The circle it is attached to can be duplicated within a white circle, or replaced with a white unit.

### Blue - Unduplicator

This ornament can be created anywhere (except under a negation ornament), and can be deleted on a black circle if all of the subexpressions have a blue ornament in the outermost slot. Duplicates of the circle it is attached to can be deleted within a black circle, and any expression with a blue ornament can be created from a black unit.

## Full rule list

There are four main tools used to interact with the circles. These are Interact (cursor icon), Pan (arrows icon), Delete (cross icon), and Add (all the icons after the divider). These are selected with Q, W, E, and the number keys respectively. You can also hold Shift to use the Delete tool no matter what's selected.

Here is a list of every rule, and the gestures used to invoke them. W, K, R, B, and A# stand for White, Black, Red, Blue, and Any, respectively. Numbers on their own stand for any expression, including nothing. The **bold** shows where to click, and *italic* shows where to release a drag if necessary. The rules can work anywhere, except inside of a circle with a negation ornament.

|Name|Tool|Input|Result|
|-|-|:-:|:-:|
|Bubble|Add label|**A1(** 2 **)**|A1(A1 2)|
|Transpose|Interact (drag)|A1(**2** *A1(3)*)|A1(A1(2 3))|
|Pop|Delete|A1(**A2(** 3 **)** 4)|A1(3 4)|
|Wrap^1|Add any color|A1(**2**)|A1(A3(2))|
|Unwrap|Delete|A1(**A3(** 2 **)**)|A1(2)|
|Split|Interact|**W**|K(1 ~1)|
|Merge|Interact (drag)|W(**1** *~1*)|K|
|Insert|Interact (drag)|W(**1** K(*2* 3))|K(W(1 2) 3)|
|Negate^2|Interact|Any negation ornament.|The connected element is inverted and all sub-elements get ~ ornaments.|
|Double negate^2|Add ~|Anything.|The element gets two ~ ornaments.|
|Select|Delete|R(**1** 2)|R(2)|
|Unselect|Interact|**B(** 1 **)**|B(1 2)|
|Copy|Interact (drag)|*R(* **1** *)*|R(1 1)|
|Uncopy|Interact (drag)|B(**1** *1*)|B(1)|
|Delete|Interact|**!** 1|W|
|Create|Interact|**K**|?1|
|Duplicate|Interact (drag)|*W(* !**1** *)*|W(!1 !1)|
|Unduplicate|Interact (drag)|K(?**1** ?*1*)|K(?1)|
|Demote|Delete|**!** 1|1|
|Promote|Add ?|**1**|?1|
|Bury^3|Add !|**W(**!1 !2 **)**|!W(!1 !2)|
|Dig^3|Delete|**?** K(?1 ?2)|K(?1 ?2)|

^1: Wrap can be used on ornaments too. This keeps the ornament and all ornaments after it on the inner circle.  
^2: Negate and Double Negate are the only rules that can be used in a circle with a negation ornament.  
^3: Bury and Dig also work directly above their respective ornaments, since those are considered a special case of a single-element white/black circle.

In addition to these moves, the tools can be used to freely build inside a green free-construct circle. Clicking with any tool outside of a free-construct zone will pop it, making it no longer editable.

