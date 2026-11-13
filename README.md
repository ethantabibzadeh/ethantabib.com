# Ethan Tabibzadeh · Adventures

Travel journal published with GitHub Pages. Each destination has an adventure gallery, a nested Eats tab, photo-based visit dates, context, and space for future notes and captions. The travel map is a separate page.

## Editing photos and videos

The content lives in `destinations.json`. Find the destination by `name`, then edit its `media` list.

- To remove an unwanted photo or video, remove its entire media entry from the JSON and commit the change. This hides it from the gallery immediately after deployment. You can leave its asset file in place.
- To add a caption, fill in that entry’s `caption`.
- To name a confirmed restaurant, set `restaurant` to its name. Leave it `null` if uncertain.
- Use `section: "eats"` for food and dining memories, or `section: "gallery"` for other trip highlights.
- Videos additionally use `type: "video"`.
- Add trip notes using the destination’s `notes` field.

Keep valid JSON, including commas between entries. Avoid deleting an asset file while its entry still exists, which would create a broken image. Public media should have private metadata removed before upload. Preserve original files separately.

## Dates and exclusions

Displayed date ranges are derived from selected media dates, not confirmed arrival and departure dates. Imported media can have unreliable dates and should be verified before inclusion. Restaurant labels are included only where identified; empty Eats sections mean no suitable food media has been confidently matched yet.

Los Angeles, Israel, and Guatemala are excluded. Guatemala was explicitly confirmed not to be Ethan’s trip.

## Development

This is a buildless HTML, CSS, and JavaScript site. Serve the repository root with a static HTTP server. `index.html` is the journal; `map.html` is the interactive map.
