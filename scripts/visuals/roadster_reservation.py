"""Render the verified US general reservation split; no production-price claim."""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
P=Path('public/images/posts/mobility')
W,H=1440,810
im=Image.new('RGB',(W,H),'#f5f2eb'); d=ImageDraw.Draw(im)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
bold='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def t(x,y,text,size=30,color='#25343c',b=False):d.text((x,y),text,font=ImageFont.truetype(bold if b else font,size),fill=color)
t(76,55,'TESLA ROADSTER / US GENERAL RESERVATION',24,b=True)
t(76,110,'$50,000 reserved. Car price still separate.',46,b=True)
t(76,185,'Payment structure shown by Tesla on September 28, 2026',26,color='#536269')
x,y,barw=76,325,1288
# Exact 10/90 percent widths; labels outside short segment for legibility
d.rectangle((x,y,x+barw*.1,y+126),fill='#d57c62')
d.rectangle((x+barw*.1,y,x+barw,y+126),fill='#304b55')
t(x,252,'$5,000',34,b=True)
t(x+barw*.1+26,361,'$45,000',40,color='#ffffff',b=True)
t(76,492,'01  INITIAL PAYMENT',25,b=True)
t(76,535,'Credit card',32)
t(740,492,'02  WITHIN 10 DAYS',25,b=True)
t(740,535,'Wire transfer',32)
d.line((76,630,1364,630),fill='#c8c8c1',width=2)
t(76,666,'Reservation only — not vehicle MSRP or a delivery guarantee',28,b=True)
t(76,726,'Source: Tesla US reservation page  |  Chart: HSL',23,color='#536269')
im.save(P/'tesla-roadster-reservation-usd.webp',quality=90,method=6)
print(im.size,(P/'tesla-roadster-reservation-usd.webp').stat().st_size)
