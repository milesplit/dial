DIAL
====

Device Input Abstraction Layer

A plugin for jQuery or Zepto that allows you to handle input from any number of devices, with various types of input events, by mapping the events to a common set of pubsub events. This allows them to be handled, independent of worrying about the platform.

====

Usage:

  * First step is to define your adapters. A Dial Adapter maps the events from a given user action and maps them to a common set of pubsub events to be handled by your application.
  * Second step is to set the handlers that listen for those pubsub events.

Dealind with Adapters:

$.dial.adapter()

With no arguments, it will return all of the adapters you've set.

$.dial.adapter('mouse')

with the type argument, it will return that specific adapter.

$.dial.adapter('mouse', { 'click':'SELECT' })

With the type and then a single-dimension key-value object, it will map those events in the object to what you specify as the value.

$.dial.adapter('keyboard', { 'keydown':{ 13:'SELECT' } })

With the type and then a multi-dimension array... the event is the first key... and then in the inner object is the e.which value. In the case of keyboard input e.which is the key code. For a mouse event, it would be the mouse button clicked.

Pub-Sub:

There is an inner pubsub object built into DIAL. You can even leverage it for other things, if you so choose.

$.dial.on('SELECT', function(e, eventName){ ));

Pass in the name of the event you want to watch and then the callback function. In the scope of the callback function, "this" is the element that was the target and "e" is the original event object (as from jQuery). The second argument is the name of the pubsub event, in case you are handling multiple listeners in one callback.

Test Support:

We built in a few properties and methods to test for the support your device has for various inputs.

$.dial.supports.touch
$.dial.supports.mouse
$.dial.supports.keyboard
$.dial.supports.orientation
$.dial.supports.geolocation
$.dial.supports.speech

We will add more when they come into use. You might use it like this....

$.dial.supports.touch ?
  $.dial.adapter('touch', { 'touchstart':'SELECT' }) : 
  $.dial.adapter('mouse', { 'click':'SELECT' });


====

Application Input Model

Premise

Increasingly web applications are becoming real applications. The browser is becoming more ubiquitous and uniform across devices. Standards support is getting better--especially with the help of Safari/Webkit, Chrome/Blink, and Firefox/Mozilla--and the feature capabilities more like its native counterparts.

With that said, there comes a new challenge. With the same web applications being accessed from disparate devices, the capabilities are completely different.

We have realized this for a while from a layout perspective. CSS has implemented rich media queries to detect all sorts of things and adjust the display accordingly. This allows you to set down the base layout of the application and then progressively enhance or gracefully degrade (depending on your approach) this layout to the device or medium.

However, things are not nearly as easy with controlling the behavior of the application. We must laboriously detect and bind to all kinds of different potential specific events to make the application do something and feel responsive in its behavior. Whether it be a click, a touchstart, or a swipe... your application must know what to do.

It is time that we abstract these various events into what they really are: inputs. If we step back and create a common terminology of inputs and we have a framework that translates those user interactions into those select input terms... then your application can respond to them completely oblivious to what device or input source it is.

Mediums and Devices

To illustrated the point, here are some of the various mediums and input types:

No Inputs (such as paper, just listing it just for completeness)
Mouse
Keyboard
Touch
Voice
Proximity to another device
Geolocation
Hand gestures
Eye movement
Brain activity
Remote control via app on another device
Motion: Tilting, turning, shaking the device as in accelerometer or gyroscope
Button press on device (not keyboard)
Whatever is next

Handling these Inputs

The potential exists for our applications to be smart to any of these potential inputs by abstracting them away. Here are the steps to do this in our applications (this would be consolidated into a framework).

Feature detect device capabilities
Implement a pub-sub framework
Kill standard event handling (such as clicks), so we can override it
Implement simple adapters for each recognized input
Listen for the various events and use the adapters to translate that into standard input terminology
Publish that input event over pub-sub, so that it can be handled appropriately by the app

Adapters

An adapter is kind of like a language file for inputs. It tells your application for a given mouse, touch, keyboard, or whatever kind of event... translate it into your input event that your application will understand.

So, for example, it often would map a “click” event with a mouse to the “SELECT” event in our input event terminology.

Proposed Standard Terminology

The input events should be all uppercase, mainly just to make them stand out. And it is similar to the common formatting you’d see for SQL syntax (“SELECT id, name FROM”) or for like an API where it is common to uppercase the HTTP methods (“GET /person/1234”).

SELECT
FOCUS
DETAILS
STEP_LEFT
STEP_RIGHT
STEP_UP
STEP_DOWN
PAGE_LEFT
PAGE_RIGHT
PAGE_UP
PAGE_DOWN
PLAY
PAUSE
STOP
FAST_FORWARD
REWIND
NEXT
PREVIOUS
DRAG_START
DRAG_MOVE
DRAG_OVER
DRAG_DROP
TEXT
….

