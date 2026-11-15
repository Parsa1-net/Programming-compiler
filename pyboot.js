/* منبع پایتونِ اجراکننده (ورودی تعاملی) و کتابخانه‌ی customtkinter مرورگری؛ داخل Web Worker اجرا می‌شود */
const PYBOOT=String.raw`import sys, json, builtins, traceback, time, random
from js import postMessage

class NeedInput(BaseException):
    pass

_S = {'skip': 0, 'total': 0, 'inputs': [], 'idx': 0, 'gui': False, 'buf': [], 'bl': 0, 'last': 0.0}

def _flush():
    b = _S['buf']
    for kind, text in b:
        postMessage(json.dumps({'k': kind, 't': text}))
    del b[:]
    _S['bl'] = 0

def _emit(kind, text):
    t = _S['total']; n = len(text); s = _S['skip']
    _S['total'] = t + n
    if t + n <= s:
        return
    if t < s:
        text = text[s - t:]
    b = _S['buf']
    if b and b[-1][0] == kind:
        b[-1][1] += text
    else:
        b.append([kind, text])
    _S['bl'] += len(text)
    now = time.time()
    if _S['bl'] > 4096 or now - _S['last'] > 0.05:
        _S['last'] = now
        _flush()

class _Out:
    encoding = 'utf-8'
    errors = 'strict'
    def __init__(self, kind):
        self.kind = kind
    def write(self, s):
        s = str(s)
        if s:
            _emit(self.kind, s)
        return len(s)
    def flush(self):
        pass
    def isatty(self):
        return False
    def writable(self):
        return True

def _next_line():
    i = _S['idx']
    if i < len(_S['inputs']):
        _S['idx'] = i + 1
        return _S['inputs'][i]
    if _S['gui']:
        raise EOFError('input() is not available inside GUI callbacks')
    _flush()
    raise NeedInput()

class _In:
    encoding = 'utf-8'
    def readline(self, *a):
        v = _next_line()
        return '' if v is None else v + '\n'
    def read(self, *a):
        out = []
        while True:
            try:
                v = _next_line()
            except NeedInput:
                if out:
                    break
                raise
            if v is None:
                break
            out.append(v + '\n')
        return ''.join(out)
    def __iter__(self):
        return self
    def __next__(self):
        l = self.readline()
        if not l:
            raise StopIteration
        return l
    def isatty(self):
        return False
    def readable(self):
        return True

def _input(prompt=''):
    if prompt:
        sys.stdout.write(str(prompt))
    v = _next_line()
    if v is None:
        raise EOFError('EOF when reading a line')
    return v

_real_sleep = time.sleep
def _sleep(s):
    if _S['total'] >= _S['skip']:
        _real_sleep(s)
time.sleep = _sleep

def _report():
    et, ev, tb = sys.exc_info()
    while tb is not None and tb.tb_frame.f_code.co_filename != 'main.py':
        tb = tb.tb_next
    sys.stderr.write(''.join(traceback.format_exception(et, ev, tb)))

def __kk_run(code, inputs_json, skip, seed):
    g = globals().get('_greset')
    if g:
        g()
    _S.update(skip=int(skip), total=0, inputs=json.loads(inputs_json), idx=0, gui=False, buf=[], bl=0, last=time.time())
    sys.stdout = _Out('o'); sys.stderr = _Out('e'); sys.stdin = _In()
    builtins.input = _input
    random.seed(int(seed))
    status = 'ok'
    ns = {'__name__': '__main__', '__builtins__': builtins}
    try:
        exec(compile(code, 'main.py', 'exec'), ns)
    except NeedInput:
        status = 'need'
    except SystemExit:
        pass
    except BaseException:
        _report()
        status = 'error'
    gf = globals().get('_gflush')
    if gf:
        gf()
    _flush()
    return json.dumps({'status': status, 'total': _S['total'], 'gui': _S['gui']})

def __kk_event(wid, typ, val_json):
    _S['skip'] = 0
    try:
        h = globals().get('_gevent')
        if h:
            h(wid, typ, json.loads(val_json))
    except BaseException:
        _report()
    gf = globals().get('_gflush')
    if gf:
        gf()
    _flush()
`;
const PYCTK=String.raw`import json, types, sys

_ops = []
_REG = {}
_TM = {}
_cnt = [0]
_ROOT = [None]
_MODE = ['dark']
_THEME = ['blue']

def _op(**k):
    _ops.append(k)

def _gflush():
    if _ops:
        postMessage(json.dumps({'k': 'gui', 'ops': list(_ops)}))
        del _ops[:]

def _greset():
    _REG.clear(); _TM.clear(); _ROOT[0] = None; del _ops[:]
    _MODE[0] = 'dark'; _THEME[0] = 'blue'

def _clean(v):
    if v is None or isinstance(v, (str, int, float, bool)):
        return v
    if isinstance(v, (tuple, list)):
        return [_clean(x) for x in v]
    if isinstance(v, dict):
        return dict((str(k), _clean(x)) for k, x in v.items())
    if isinstance(v, CTkFont):
        return v._d
    return None

def _root():
    if _ROOT[0] is None:
        raise RuntimeError('Create the main window first: app = customtkinter.CTk()')
    return _ROOT[0]

def set_appearance_mode(m):
    _MODE[0] = str(m).lower()
    if _ROOT[0] is not None:
        _op(op='mode', mode=_MODE[0])

def get_appearance_mode():
    return 'Dark' if _MODE[0] != 'light' else 'Light'

def set_default_color_theme(t):
    _THEME[0] = str(t).replace('.json', '')
    if _ROOT[0] is not None:
        _op(op='theme', theme=_THEME[0])

def set_widget_scaling(x): pass
def set_window_scaling(x): pass

class CTkFont:
    def __init__(self, master=None, family=None, size=None, weight='normal', slant='roman', underline=False, overstrike=False):
        self._d = {'family': family, 'size': size, 'weight': weight, 'slant': slant, 'underline': underline}

class _Var:
    _d = ''
    def __init__(self, master=None, value=None, name=None):
        self._v = self._d if value is None else self._cast(value)
        self._w = []
        self._tr = []
    def get(self):
        return self._v
    def set(self, v):
        self._v = self._cast(v)
        for w in self._w:
            _op(op='set', id=w, value=self._v)
        for f in list(self._tr):
            f()
    def _setfrom(self, wid, v):
        try:
            self._v = self._cast(v)
        except Exception:
            self._v = v
        for w in self._w:
            if w != wid:
                _op(op='set', id=w, value=self._v)
        for f in list(self._tr):
            f()
    def trace_add(self, mode, cb):
        self._tr.append(lambda: cb('', '', 'write'))
    trace = trace_add

class StringVar(_Var):
    _d = ''
    _cast = staticmethod(str)
class IntVar(_Var):
    _d = 0
    _cast = staticmethod(int)
class DoubleVar(_Var):
    _d = 0.0
    _cast = staticmethod(float)
class BooleanVar(_Var):
    _d = False
    _cast = staticmethod(bool)

class _Misc:
    def after(self, ms, fn=None, *a):
        _cnt[0] += 1
        t = 't%d' % _cnt[0]
        _TM[t] = (lambda: fn(*a)) if fn else (lambda: None)
        _op(op='after', id=t, ms=int(ms))
        return t
    def after_idle(self, fn, *a):
        return self.after(0, fn, *a)
    def after_cancel(self, t):
        _TM.pop(t, None)
    def update(self):
        _gflush()
    update_idletasks = update
    def grid_columnconfigure(self, i, weight=None, **kw):
        _op(op='gcfg', id=self._id, axis='col', index=i if isinstance(i, int) else 0, weight=weight or 0)
    def grid_rowconfigure(self, i, weight=None, **kw):
        _op(op='gcfg', id=self._id, axis='row', index=i if isinstance(i, int) else 0, weight=weight or 0)
    columnconfigure = grid_columnconfigure
    rowconfigure = grid_rowconfigure
    def bind(self, seq, fn=None, add=None):
        self._binds[seq] = fn
        _op(op='bind', id=self._id, seq=seq)
    def winfo_screenwidth(self):
        return 1920
    def winfo_screenheight(self):
        return 1080

class _Widget(_Misc):
    _type = 'frame'
    def __init__(self, master=None, **kw):
        _cnt[0] += 1
        self._id = 'w%d' % _cnt[0]
        _REG[self._id] = self
        self.master = master if master is not None else _root()
        self._cmd = kw.pop('command', None)
        self._var = kw.pop('variable', None)
        self._tv = kw.pop('textvariable', None)
        self._binds = {}
        self._kw = kw
        self._val = self._init_val(kw)
        for v in (self._var, self._tv):
            if v is not None:
                v._w.append(self._id)
        if self._tv is not None:
            self._val = self._tv.get()
            kw['text' if self._type == 'label' else 'value'] = self._val
        _op(op='new', id=self._id, type=self._type, parent=self.master._id, props=_clean(self._props()))
    def _init_val(self, kw):
        return None
    def _props(self):
        p = dict(self._kw)
        if self._var is not None and self._type in ('radio', 'checkbox', 'switch'):
            p['checked'] = self._checked()
        return p
    def _checked(self):
        return False
    def _push(self, v):
        for var in (self._var, self._tv):
            if var is not None:
                var._setfrom(self._id, v)
    def _setval(self, val):
        pass
    def _call_cmd(self, val):
        self._cmd()
    def _event(self, typ, val):
        if typ == 'val':
            self._setval(val)
        elif typ == 'cmd':
            self._setval(val)
            if self._cmd:
                self._call_cmd(val)
        elif typ == 'bind':
            f = self._binds.get(val.get('seq'))
            if f:
                f(types.SimpleNamespace(widget=self, keysym=val.get('keysym', ''), char=val.get('char', ''), x=val.get('x', 0), y=val.get('y', 0)))
    def pack(self, **kw):
        _op(op='lay', id=self._id, mgr='pack', opts=_clean(kw))
    def grid(self, **kw):
        _op(op='lay', id=self._id, mgr='grid', opts=_clean(kw))
    def place(self, **kw):
        _op(op='lay', id=self._id, mgr='place', opts=_clean(kw))
    def pack_forget(self):
        _op(op='unlay', id=self._id)
    grid_forget = place_forget = pack_forget
    def destroy(self):
        _op(op='del', id=self._id)
        _REG.pop(self._id, None)
    def configure(self, **kw):
        if 'command' in kw:
            self._cmd = kw.pop('command')
        if 'textvariable' in kw:
            self._tv = kw['textvariable']
            self._tv._w.append(self._id)
            kw['text'] = self._tv.get()
        self._kw.update(kw)
        _op(op='cfg', id=self._id, props=_clean(kw))
    config = configure
    def cget(self, k):
        return self._kw.get(k)
    def focus(self):
        _op(op='focus', id=self._id)
    focus_set = focus_force = focus
    def get(self):
        return self._val
    def set(self, v):
        self._val = v
        _op(op='set', id=self._id, value=v)
        self._push(v)

class CTkFrame(_Widget):
    _type = 'frame'
class CTkScrollableFrame(_Widget):
    _type = 'sframe'
class CTkLabel(_Widget):
    _type = 'label'
class CTkButton(_Widget):
    _type = 'button'
    def invoke(self):
        if self._cmd:
            self._cmd()
    def flash(self):
        pass

class CTkEntry(_Widget):
    _type = 'entry'
    def _init_val(self, kw):
        return ''
    def _setval(self, val):
        self._val = str(val)
        self._push(self._val)
    def _call_cmd(self, val):
        self._cmd()
    def _ix(self, i):
        if i in ('end', 'END'):
            return len(self._val)
        return max(0, min(int(i), len(self._val)))
    def insert(self, index, text):
        i = self._ix(index)
        self._val = self._val[:i] + str(text) + self._val[i:]
        _op(op='set', id=self._id, value=self._val)
        self._push(self._val)
    def delete(self, a, b=None):
        i = self._ix(a)
        j = i + 1 if b is None else self._ix(b)
        self._val = self._val[:i] + self._val[j:]
        _op(op='set', id=self._id, value=self._val)
        self._push(self._val)

class CTkTextbox(_Widget):
    _type = 'textbox'
    def _init_val(self, kw):
        return ''
    def _setval(self, val):
        self._val = str(val)
    def get(self, a='0.0', b='end'):
        return self._val + '\n' if b in ('end', 'END') else self._val
    def insert(self, index, text, tags=None):
        if str(index).lower() in ('end', 'tk.end'):
            self._val += str(text)
        else:
            self._val = str(text) + self._val
        _op(op='set', id=self._id, value=self._val)
    def delete(self, a, b=None):
        self._val = ''
        _op(op='set', id=self._id, value='')
    def see(self, i):
        pass

class _Toggle(_Widget):
    def _init_val(self, kw):
        self._on = kw.get('onvalue', 1)
        self._off = kw.get('offvalue', 0)
        self._chk = False
        return self._off
    def _checked(self):
        return self._var.get() == self._on if self._var is not None else self._chk
    def _setval(self, val):
        self._chk = bool(val)
        self._val = self._on if val else self._off
        self._push(self._val)
    def select(self):
        self._setval(True); _op(op='set', id=self._id, value=True)
    def deselect(self):
        self._setval(False); _op(op='set', id=self._id, value=False)
    def toggle(self):
        self._setval(not self._chk); _op(op='set', id=self._id, value=self._chk)
    def invoke(self):
        self.toggle()
        if self._cmd:
            self._cmd()
class CTkCheckBox(_Toggle):
    _type = 'checkbox'
class CTkSwitch(_Toggle):
    _type = 'switch'

class CTkRadioButton(_Widget):
    _type = 'radio'
    def _init_val(self, kw):
        return kw.get('value', 0)
    def _checked(self):
        return self._var is not None and self._var.get() == self._val
    def _setval(self, val):
        if self._var is not None and val:
            self._var._setfrom(self._id, self._val)
    def select(self):
        if self._var is not None:
            self._var.set(self._val)
    def invoke(self):
        self.select()
        if self._cmd:
            self._cmd()

class CTkSlider(_Widget):
    _type = 'slider'
    def _init_val(self, kw):
        return (kw.get('from_', 0) + kw.get('to', 1)) / 2
    def _setval(self, val):
        self._val = float(val)
        self._push(self._val)
    def _call_cmd(self, val):
        self._cmd(self._val)

class CTkProgressBar(_Widget):
    _type = 'progress'
    def _init_val(self, kw):
        return 0.5
    def start(self):
        pass
    def stop(self):
        pass
    def step(self):
        self.set(min(1, self._val + 0.02))

class CTkComboBox(_Widget):
    _type = 'combo'
    def _init_val(self, kw):
        v = kw.get('values') or ['']
        return v[0]
    def _setval(self, val):
        self._val = str(val)
        self._push(self._val)
    def _call_cmd(self, val):
        self._cmd(self._val)
class CTkOptionMenu(CTkComboBox):
    _type = 'option'
class CTkSegmentedButton(CTkComboBox):
    _type = 'seg'

class CTkImage:
    def __init__(self, *a, **k):
        raise NotImplementedError('CTkImage is not supported in the browser version yet')
class CTkToplevel:
    def __init__(self, *a, **k):
        raise NotImplementedError('CTkToplevel is not supported in the browser version yet; use frames')
class CTkTabview:
    def __init__(self, *a, **k):
        raise NotImplementedError('CTkTabview is not supported in the browser version yet; use CTkSegmentedButton + frames')

class CTk(_Misc):
    def __init__(self, fg_color=None, **kw):
        if _ROOT[0] is not None:
            raise RuntimeError('Only one CTk() window is supported')
        self._id = 'root'
        _REG['root'] = self
        _ROOT[0] = self
        self._binds = {}
        self._close = None
        _op(op='win', id='root', title='CTk', w=400, h=300, mode=_MODE[0], theme=_THEME[0], fg=_clean(fg_color))
    def title(self, t=None):
        if t is not None:
            _op(op='title', text=str(t))
    wm_title = title
    def geometry(self, g=None):
        import re
        m = re.match(r'\s*(\d+)\s*x\s*(\d+)', str(g or ''))
        if m:
            _op(op='size', w=int(m.group(1)), h=int(m.group(2)))
    def configure(self, **kw):
        _op(op='cfg', id='root', props=_clean(kw))
    config = configure
    def protocol(self, name, fn=None):
        if name == 'WM_DELETE_WINDOW':
            self._close = fn
    def mainloop(self, n=0):
        _S['gui'] = True
        _gflush()
    def quit(self):
        self.destroy()
    def destroy(self):
        _op(op='quit')
        _S['gui'] = False
        _TM.clear()
        _gflush()
    def _event(self, typ, val):
        if typ == 'close':
            if self._close:
                self._close()
            else:
                self.destroy()
        elif typ == 'bind':
            f = self._binds.get(val.get('seq'))
            if f:
                f(types.SimpleNamespace(widget=self, keysym=val.get('keysym', ''), char=val.get('char', ''), x=0, y=0))
    def resizable(self, *a, **k): pass
    def attributes(self, *a, **k): pass
    def iconbitmap(self, *a, **k): pass
    def minsize(self, *a, **k): pass
    def maxsize(self, *a, **k): pass
    def state(self, *a, **k): pass
    def withdraw(self): pass
    def deiconify(self): pass
    def lift(self, *a): pass
    def focus_force(self): pass
    def overrideredirect(self, *a): pass

def _gevent(wid, typ, val):
    if typ == 'after':
        fn = _TM.pop(wid, None)
        if fn:
            fn()
        return
    w = _REG.get(wid)
    if w is not None:
        w._event(typ, val)

def _alert(kind):
    def f(title=None, message=None, **kw):
        _op(op='alert', kind=kind, title=str(title or ''), text=str(message or ''))
        _gflush()
        return {'askyesno': True, 'askokcancel': True, 'askretrycancel': True, 'askquestion': 'yes'}.get(kind, 'ok')
    return f

def _install():
    ct = types.ModuleType('customtkinter')
    for n in ('CTk', 'CTkFrame', 'CTkScrollableFrame', 'CTkLabel', 'CTkButton', 'CTkEntry', 'CTkTextbox', 'CTkCheckBox',
              'CTkSwitch', 'CTkRadioButton', 'CTkSlider', 'CTkProgressBar', 'CTkComboBox', 'CTkOptionMenu',
              'CTkSegmentedButton', 'CTkFont', 'CTkImage', 'CTkToplevel', 'CTkTabview', 'StringVar', 'IntVar',
              'DoubleVar', 'BooleanVar', 'set_appearance_mode', 'get_appearance_mode', 'set_default_color_theme',
              'set_widget_scaling', 'set_window_scaling'):
        setattr(ct, n, globals()[n])
    tk = types.ModuleType('tkinter')
    for n in ('StringVar', 'IntVar', 'DoubleVar', 'BooleanVar'):
        setattr(tk, n, globals()[n])
    tk.Tk = CTk
    for k, v in dict(END='end', INSERT='insert', NORMAL='normal', DISABLED='disabled', LEFT='left', RIGHT='right',
                     TOP='top', BOTTOM='bottom', BOTH='both', X='x', Y='y', N='n', S='s', E='e', W='w', NS='ns',
                     EW='ew', NSEW='nsew', CENTER='center', YES=True, NO=False).items():
        setattr(tk, k, v)
    def _nope(name):
        def f(*a, **k):
            raise NotImplementedError('tkinter.%s is not available; use the customtkinter equivalent (CTk%s)' % (name, name))
        return f
    for n in ('Label', 'Button', 'Entry', 'Frame', 'Text', 'Checkbutton', 'Scale', 'Canvas', 'Listbox', 'Radiobutton', 'Toplevel'):
        setattr(tk, n, _nope(n))
    mb = types.ModuleType('tkinter.messagebox')
    for n in ('showinfo', 'showwarning', 'showerror', 'askyesno', 'askokcancel', 'askretrycancel', 'askquestion'):
        setattr(mb, n, _alert(n))
    tk.messagebox = mb
    sys.modules['customtkinter'] = ct
    sys.modules['tkinter'] = tk
    sys.modules['tkinter.messagebox'] = mb
_install()
`;
