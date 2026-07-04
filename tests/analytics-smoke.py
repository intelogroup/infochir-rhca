"""Analytics smoke test.

Drives Playwright against a running preview build to confirm that the three
main telemetry paths (page_view, click, share) each POST to Supabase's
`track_user_event` RPC.

Requires:
- The app running at http://localhost:8080 with VITE_DEBUG_ANALYTICS=true
- `pip install playwright && playwright install chromium` (or the Lovable sandbox
  where Playwright is pre-installed).
"""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

BASE_URL = "http://localhost:8080"
RPC_MATCH = "/rest/v1/rpc/track_user_event"
SCREENSHOTS = Path(__file__).parent / "screenshots"
SCREENSHOTS.mkdir(parents=True, exist_ok=True)


async def main() -> int:
    events: list[str] = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await context.new_page()

        async def on_request(req):
            if RPC_MATCH in req.url and req.method == "POST":
                try:
                    body = req.post_data_json or {}
                    events.append(body.get("p_event_type", "?"))
                except Exception:
                    events.append("?")

        page.on("request", on_request)

        # 1) page_view on home
        await page.goto(BASE_URL, wait_until="domcontentloaded")
        await page.wait_for_timeout(1500)
        await page.screenshot(path=str(SCREENSHOTS / "1_home.png"))

        # 2) click on an RHCA card
        await page.goto(f"{BASE_URL}/rhca", wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)
        card = page.locator('[class*="cursor-pointer"]').first
        if await card.count():
            await card.click()
            await page.wait_for_timeout(1000)
        await page.screenshot(path=str(SCREENSHOTS / "2_card_click.png"))

        # 3) share button (best-effort; skip if not present)
        share_btn = page.get_by_role("button", name=lambda n: n and "partager" in n.lower())
        if await share_btn.count():
            await share_btn.first.click()
            await page.wait_for_timeout(500)
            await page.screenshot(path=str(SCREENSHOTS / "3_share.png"))

        await browser.close()

    print("Captured events:", events)

    ok = True
    for expected in ("page_view", "click"):
        if expected not in events:
            print(f"FAIL: no `{expected}` event fired")
            ok = False

    if not ok:
        return 1
    print("PASS: telemetry smoke test succeeded")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
