# The Dots

A tiny digital world where simple dots move, compete, survive, and slowly develop better behavior over time.

---

## The 10-second version

This is a simulation of little digital creatures.

They move around, lose energy, collide with each other, and survive by being more successful than the others.

The interesting part is that nobody tells them what to do.

If one dot happens to behave in a way that helps it survive, more future dots begin to act like it.

Over time, behavior starts to change.

---

## The 30-second version

Each dot is like a very simple artificial creature.

Every dot has:

- a position on the screen
- energy
- a color
- a tiny decision-making system
- the ability to move

Dots wander around and interact with other dots.

If a stronger dot reaches a weaker one, the weaker one is removed and replaced by a new dot based on a successful survivor.

That new dot is almost the same as its parent, but slightly changed.

Those tiny changes build up over time.

That means the whole population can gradually improve at survival without ever being directly taught.

---

## What you are seeing

At first, the dots may look random.

That is expected.

In the beginning, they do not “know” anything.

But as the simulation keeps running, some behaviors may start to appear:

- chasing weaker dots
- avoiding stronger dots
- moving more efficiently
- forming noticeable patterns

These behaviors are not manually programmed.

They appear because dots that survive tend to pass on the traits that helped them survive.

---

## Why this is interesting

This project is a small example of a big idea:

**complex behavior can emerge from simple rules**

There is no master plan.
There is no script telling the dots how to act.
There is no human controlling each move.

Instead, the system creates behavior through:

- survival
- variation
- repetition over time

That is why it can feel surprising to watch.

You are not just watching moving pixels.

You are watching a system where behavior can slowly take shape on its own.

---

## The simple version of how it works

The world follows a few basic rules:

### 1. Every dot moves

Each dot chooses how to move based on what it “senses.”

### 2. Moving costs energy

A dot cannot move forever for free.

Over time it loses energy.

### 3. Dots interact

When dots get close enough, stronger ones can overpower weaker ones.

### 4. Lost dots are replaced

When a dot is removed, a new one is created from another dot that is already in the world.

### 5. The new dot is slightly different

The replacement is similar to its parent, but not identical.

This is what allows change to happen over time.

---

## A little deeper

Each dot has a very small artificial “brain.”

That brain helps it decide how to move based on things like:

- its age
- its energy
- its current direction
- where nearby dots are
- which nearby dots are weaker or stronger

The brain does not contain knowledge like:

- “go hunt”
- “run away”
- “protect yourself”

Instead, it starts out basically unhelpful.

Over time, small changes are introduced.

Some changes make a dot worse.
Some do nothing.
A few help it survive longer.

The helpful ones are more likely to spread.

That is where the improvement comes from.

---

## What "evolution" means here

In this simulation, evolution does **not** mean the dots are thinking like humans or becoming magically intelligent.

It means:

- successful behaviors stick around
- unsuccessful behaviors disappear
- small changes accumulate
- the population shifts over time

In other words, the dots are not being taught.

They are being filtered.

The behaviors that work tend to remain.

---

## What "emergent behavior" means here

**Emergent behavior** is when something more interesting appears from simple parts interacting.

A single dot is simple.

The rules are simple.

But when many dots exist together and those rules repeat over and over, the overall result can look much more complex than the starting ingredients.

That is emergence.

It is one of the main reasons projects like this are fun to explore.

---

## If you know nothing about code

That is completely fine.

You do not need to understand the code to understand the idea.

A good way to think about it is this:

- imagine a tiny digital ecosystem
- each dot is a creature
- creatures that do better leave behind more copies of themselves
- those copies are slightly changed
- over time the population changes

That is the core idea.

---

## If you know a little more

This project sits in the overlap between:

- artificial life
- evolution
- simulation
- simple machine decision-making

It is less about building a useful product and more about exploring a question:

**What kinds of behavior can appear if we start with simple rules and let the system run?**

---

## If you know even more

Under the hood, each dot uses a small network of values to turn inputs into movement choices.

The simulation repeatedly does this:

1. gather information
2. make a movement decision
3. apply energy cost
4. resolve interactions
5. replace failed dots with altered descendants

This creates a selection loop.

The system does not “train” in the usual way.

Instead, it changes through repeated survival pressure.

---

## What to try

If you run the simulation, try doing this:

- watch it for longer than you think you need to
- look for repeating movement styles
- notice whether some colors or groups seem more successful
- click to inspect the brain visualization
- ask yourself whether what you are seeing feels random, strategic, or somewhere in between

The fun of the project is partly in that uncertainty.

---

## How to run it

Open `index.html` in a web browser.

That is it.

The simulation starts automatically.

---

## Final thought

At a glance, this looks like a bunch of dots wandering around.

But if you stay with it a little longer, it becomes something more interesting:

a tiny world where behavior is not scripted, but slowly discovered.
