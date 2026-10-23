// 文件路径：functions/api/state.js
// 在 Cloudflare Pages 设置 -> 绑定 (Bindings) 中添加 KV 命名空间，变量名设为 BLOG_KV

export async function onRequestGet(context) {
  const { env } = context;
  if (!env.BLOG_KV) {
    return new Response(JSON.stringify({ error: "请先在 Pages 设置中绑定名为 BLOG_KV 的 KV 命名空间" }), {
      status: 500,
      headers: { "Content-Type": "application/json;charset=UTF-8" }
    });
  }
  const data = await env.BLOG_KV.get("site_state");
  return new Response(data || "{}", {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Cache-Control": "no-store"
    }
  });
}

export async function onRequestPut(context) {
  const { request, env } = context;
  const body = await request.text();
  await env.BLOG_KV.put("site_state", body);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });
}
