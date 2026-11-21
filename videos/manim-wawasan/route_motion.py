"""Procedural motion prototype. NOT a real Wawasan GPS route or app UI."""
from manim import *
import numpy as np

config.frame_width=8
config.frame_height=14.222222
config.background_color="#291A17"

class WawasanRoute(Scene):
    def construct(self):
        cream=ManimColor("#F8EAD1")
        amber=ManimColor("#F4A51C")
        rust=ManimColor("#A75130")
        heading=Text("PATH IN MOTION",font="DejaVu Sans",weight=BOLD,color=cream)
        heading.scale(0.46).to_edge(UP,buff=1.0)
        tag=Text("WAWASAN / GEOMETRIC MOTION LAB",font="DejaVu Sans",
            weight=BOLD,color=amber).scale(0.22).next_to(heading,DOWN,buff=.36)
        boundary=RoundedRectangle(width=6.8,height=9.2,corner_radius=.28,
            color=rust,stroke_width=2.6)
        boundary.shift(DOWN*.05)
        self.add(boundary)
        segment_a=CubicBezier(
            start=np.array([-2.65,-3.75,0]),
            control1=np.array([-1.35,-2.45,0]),
            control2=np.array([-2.25,-.95,0]),
            end=np.array([-.25,-.15,0]),
            color=amber,stroke_width=14)
        segment_b=CubicBezier(
            start=segment_a.get_end(),
            control1=np.array([1.65,.68,0]),
            control2=np.array([1.78,2.35,0]),
            end=np.array([2.65,3.45,0]),
            color=amber,stroke_width=14)
        route=VMobject().set_stroke(amber,width=14)
        route.set_points(np.concatenate([segment_a.get_points(),segment_b.get_points()]))
        start_marker=Dot(route.get_start(),radius=.13,color=cream)
        rider=Dot(route.get_start(),radius=.21,color=amber)
        destination=Circle(radius=.25,color=cream,stroke_width=6)
        destination.move_to(route.get_end())
        footer=Text("ABSTRACT PATH / NOT LIVE GPS DATA",
            font="DejaVu Sans",color=cream,weight=BOLD).scale(.22)
        footer.to_edge(DOWN,buff=.9)
        self.play(FadeIn(heading,shift=UP*.16),FadeIn(tag),run_time=.6)
        self.add(start_marker,rider)
        self.play(Create(route),MoveAlongPath(rider,route),run_time=2.2,rate_func=smooth)
        self.play(GrowFromCenter(destination),FadeIn(footer,shift=UP*.2),run_time=.55)
        self.wait(.6)
