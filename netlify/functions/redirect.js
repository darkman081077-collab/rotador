   import { getStore } from "@netlify/blobs";

   export default async () => {
     const links = [
       "https://wa.me/5411571471571",
       "https://wa.me/541172345929"
     ];

     const store = getStore("contador");
     let i = await store.get("indice", { type: "json" });

     if (i === null) i = 0;

     const url = links[i];
     const nextI = (i + 1) % 2;

     await store.set("indice", JSON.stringify(nextI));

     return Response.redirect(url, 302);
   }
