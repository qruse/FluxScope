"""Deterministic reference visuals. Run from repo root with Pillow + Matplotlib."""
from pathlib import Path
from io import BytesIO
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
from PIL import Image
ROOT=Path('public/images/posts')
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':13,'axes.spines.top':False,'axes.spines.right':False,'axes.titleweight':'bold'})
FX=1354.81 # Xe, 2026-09-26 23:08 UTC. Korean launch prices; not US MSRP.
def save(fig,path):
 b=BytesIO();fig.savefig(b,format='png',dpi=100,facecolor='#faf9f6');plt.close(fig);b.seek(0)
 f=ROOT/path;f.parent.mkdir(parents=True,exist_ok=True);Image.open(b).convert('RGB').save(f,'WEBP',quality=88)
 print(f, f.stat().st_size)
def prices(labels,won,title,path):
 fig,ax=plt.subplots(figsize=(14,6.8));fig.subplots_adjust(left=.24,right=.89,top=.8,bottom=.22)
 vals=[v/FX for v in won];bars=ax.barh(labels,vals,color=['#819599']*(len(vals)-1)+['#b66b45'],height=.55);ax.invert_yaxis();ax.set_xlim(0,max(vals)*1.18)
 for bar,v in zip(bars,vals):ax.text(v+160,bar.get_y()+bar.get_height()/2,f'${v:,.0f}',va='center',fontweight='bold')
 ax.xaxis.set_major_formatter(FuncFormatter(lambda x,p:f'${x/1000:g}k'));ax.set_xlabel('Approximate USD • Korean-market prices');ax.grid(axis='x',alpha=.15);ax.set_axisbelow(True)
 fig.text(.05,.9,title,fontsize=23,fontweight='bold');fig.text(.05,.065,'Sources: Hyundai price sheets • FX: Xe, Sep 26, 2026, 23:08 UTC\nConverted Korean launch prices; not US MSRP. Registration, insurance and extra paint excluded.',fontsize=11,color='#555555')
 save(fig,path)
prices(['Old Smart 1.6','Old Modern 1.6','New Modern 2.0'],[20620000,23880000,23980000],'The entry point moved more than the Modern badge','mobility/all-new-avante-price-entry-usd.webp')
prices(['Modern base','+ Heated-seat bundle','+ Map bundle','+ 9.9-inch cluster'],[23980000,24630000,25590000,25940000],'A compact car, a growing options total','mobility/all-new-avante-option-total.webp')
fig,ax=plt.subplots(figsize=(14,6.8));fig.subplots_adjust(left=.1,right=.95,top=.76,bottom=.22)
import numpy as np
x=np.arange(2);w=.28
for offset,vals,label,color in [(-w/2,[100,150],'Best loop','#80969a'),(w/2,[60,90],'Worst loop','#bf7953')]:
 bars=ax.bar(x+offset,vals,w,label=label,color=color)
 ax.bar_label(bars,padding=5)
ax.set_xticks(x,['Example A: 60 / 100 = 60%','Example B: 90 / 150 = 60%']);ax.set_ylabel('Illustrative score');ax.set_ylim(0,180);ax.legend(frameon=False,loc='upper left');ax.grid(axis='y',alpha=.15);ax.set_axisbelow(True)
fig.text(.06,.9,'Same retention ratio. Different performance left.',fontsize=23,fontweight='bold');fig.text(.06,.07,'Hypothetical numbers, NOT iPhone measurements.\nRetention = worst loop / best loop × 100. Definition: UL Benchmarks.',fontsize=12,color='#555555');save(fig,'it-devices/stability-ratio-example.webp')
fig,ax=plt.subplots(figsize=(14,7.5));fig.subplots_adjust(left=.03,right=.97,top=.83,bottom=.16);ax.set_xlim(0,10);ax.set_ylim(0,6);ax.axis('off')
def box(x,y,t,c='#edf0ed'):
 ax.text(x,y,t,ha='center',va='center',fontsize=14,bbox=dict(boxstyle='round,pad=.65',facecolor=c,edgecolor='#526469'))
def arrow(a,b,label=None):
 ax.annotate('',xy=b,xytext=a,arrowprops=dict(arrowstyle='->',lw=2,color='#526469'))
 if label:ax.text((a[0]+b[0])/2+.13,(a[1]+b[1])/2,label,fontsize=11,backgroundcolor='#faf9f6')
box(1.45,4.7,'Fix task + checks\nSet retry limit');box(5,4.7,'Run candidate\nLog spend + time');box(8.5,4.7,'Check result');box(8.5,2.6,'Accept task','#e0eadc');box(5,1,'Retry budget left?');box(1.45,1,'Escalate to model\nor human','#f2e1d6')
arrow((2.85,4.7),(3.6,4.7));arrow((6.5,4.7),(7.45,4.7));arrow((8.5,4),(8.5,3.3),'Pass');arrow((8,4.1),(5.5,1.7),'Fail');arrow((4.75,1.7),(4.75,4),'Yes');arrow((3.55,1),(2.85,1),'No')
fig.text(.055,.92,'Cheap calls need a stopping rule',fontsize=24,fontweight='bold');fig.text(.055,.055,'Proposed workflow, not measured model superiority. Keep all retries and escalation costs with the original task.\nAccepted-task API cost = total API spend / accepted tasks. Track human review minutes separately.',fontsize=12,color='#555555');save(fig,'ai/acceptance-pipeline.webp')
