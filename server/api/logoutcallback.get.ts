export default defineEventHandler(async event => {
    setCookie(event, "srtoken", "")
    setCookie(event, "sruser", "")
    await sendRedirect(event, "/")
})