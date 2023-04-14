/// <reference types="@fastly/js-compute" />

import { Router } from "@fastly/expressly"
const router = new Router()

const sharedVercelBackend = {
	name: "vercel",
	target: "api.svn.sh",
	hostOverride: "api.svn.sh",
	connectTimeout: 1000,
	firstByteTimeout: 15000,
	betweenBytesTimeout: 10000,
	useSSL: true,
	sslMinVersion: 1.3,
	sslMaxVersion: 1.3,
}

// Use middleware to set a header
router.use((req, res) => {
	res.set("x-powered-by", "svn.io")
})

// GET 200 response
router.get("/", (req, res) => {
	res.sendStatus(200) // "OK"
})

router.get("/check/:customerId/:featureId", async (req, res) => {
	const customerId = req.params.customerId
	const featureId = req.params.featureId

	const backend = new Backend(sharedVercelBackend)

	// get tenantKey from headers
	const tenantKey = req.headers.get("x-tenant-key")

	let response = await fetch(
		`https://api.svn.sh/api/client/check-feature?customerId=${customerId}&featureId=${featureId}`,
		{
			backend,
			headers: {
				"x-tenant-key": tenantKey,
				"Content-Type": "application/json",
			},
		}
	)

	// surrogote keys
	res.headers.append(
		"Surrogate-Key",
		`check-feature ${tenantKey} ${customerId} ${featureId}`
	)

	res.send(response)
})

router.get("/check-limit/:customerId/:featureId", async (req, res) => {
	const customerId = req.params.customerId
	const featureId = req.params.featureId

	const backend = new Backend(sharedVercelBackend)

	// get tenantKey from headers
	const tenantKey = req.headers.get("x-tenant-key")

	let response = await fetch(
		`https://api.svn.sh/api/client/check-feature-limit?customerId=${customerId}&featureId=${featureId}`,
		{
			backend,
			headers: {
				"x-tenant-key": tenantKey,
				"Content-Type": "application/json",
			},
		}
	)

	// surrogote keys
	res.headers.append(
		"Surrogate-Key",
		`check-feature ${tenantKey} ${customerId} ${featureId}`
	)

	res.send(response)
})

// 404/405 response for everything else

router.listen()
