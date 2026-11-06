#!/usr/bin/env python3
"""
Import a show (brand + show + looks) from a JSON file into Supabase.

Usage:
    export SUPABASE_URL=https://your-project.supabase.co
    export SUPABASE_SECRET_KEY=sb_secret_...     # NEVER commit this or put it in the web app
    python3 scripts/import_show.py scripts/example_show.json

Re-running with the same slugs updates the existing rows instead of duplicating them.
Uses only the Python standard library.
"""
import json
import os
import sys
import urllib.error
import urllib.request

URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
KEY = os.environ.get("SUPABASE_SECRET_KEY", "")


def upsert(table: str, rows: list[dict], on_conflict: str) -> list[dict]:
    req = urllib.request.Request(
        f"{URL}/rest/v1/{table}?on_conflict={on_conflict}",
        data=json.dumps(rows).encode(),
        method="POST",
        headers={
            "apikey": KEY,
            "Authorization": f"Bearer {KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=representation",
        },
    )
    try:
        with urllib.request.urlopen(req) as res:
            return json.loads(res.read())
    except urllib.error.HTTPError as e:
        sys.exit(f"Error writing to {table}: {e.code} {e.read().decode()}")


def main(path: str) -> None:
    if not URL or not KEY:
        sys.exit("Set SUPABASE_URL and SUPABASE_SECRET_KEY first.")
    with open(path) as f:
        data = json.load(f)

    brand = upsert("brands", [data["brand"]], "slug")[0]

    show_fields = {k: v for k, v in data["show"].items()}
    show_fields["brand_id"] = brand["id"]
    show = upsert("shows", [show_fields], "slug")[0]

    looks = [{**look, "show_id": show["id"]} for look in data.get("looks", [])]
    if looks:
        upsert("looks", looks, "show_id,look_number")

    print(f"Imported {brand['name']} — {show['title']} ({len(looks)} looks) → /shows/{show['slug']}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
