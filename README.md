# Maptiler Map

Simple web map with search functionality using Flask and MapTiler.

## What's Inside

- Location search with dropdown
- Two map styles (Bright and Topo)
- Keyboard navigation for search results

## Setup

```bash
pip install flask
python app.py
```

Add your MapTiler API key in `app.py`.

Open `http://localhost:5000`

## Structure

```
├── app.py           # Flask app
├── templates/
│   └── index.html   # HTML
└── static/
    ├── map.js       # Map logic
    └── style.css    # Styles
```

## Keys

- `↓/↑` - Navigate results
- `Enter` - Select
- `Esc` - Close

## License

MIT


