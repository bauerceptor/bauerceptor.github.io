+++
title = "API Reference"
description = "Full API documentation for Demo Project."
weight = 2

[extra]
lang            = "en"
sidebar_section = "Reference"
math    = false
copy    = true
comment = false
+++

## `run(input, options)`

Main entry point.

| Parameter | Type     | Default | Description              |
|-----------|----------|---------|--------------------------|
| `input`   | `str`    | —       | The input string         |
| `options` | `dict`   | `{}`    | Optional config overrides|

**Returns:** `str`

**Example:**

```python
result = run("hello", options={"verbose": True})
```

## `configure(path)`

Load configuration from a TOML file.

```python
configure("/path/to/config.toml")
```

Add more API entries here following the same pattern.
