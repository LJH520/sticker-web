---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: _APP_NAME_
  labels:
    app: _APP_NAME_
spec:
  replicas: _REPLICAS_
  selector:
    matchLabels:
      app: _APP_NAME_
  template:
    metadata:
      labels:
        app: _APP_NAME_
    spec:
      nodeSelector:
        nodegroup: global-test
      tolerations:
        - key: nodegroup
          operator: Exists
      terminationGracePeriodSeconds: 60
      containers:
        - name: _APP_NAME_
          image: swr.cn-north-4.myhuaweicloud.com/global/_APP_NAME_:_VERSION_
          imagePullPolicy: Always
          env:
            - name: TZ
              value: Asia/Shanghai
          lifecycle:
            preStop:
              exec:
                command: ["/bin/sh", "-c", "sleep 10"]
          ports:
            - containerPort: 80
          readinessProbe:
            tcpSocket:
              port: 80
            initialDelaySeconds: 20
            timeoutSeconds: 2
            periodSeconds: 5
            successThreshold: 2
            failureThreshold: 30
          livenessProbe:
            tcpSocket:
              port: 80
            initialDelaySeconds: 60
            timeoutSeconds: 3
            periodSeconds: 10
            successThreshold: 1
            failureThreshold: 10
      imagePullSecrets:
        - name: default-secret
---
kind: Service
apiVersion: v1
metadata:
  name: _APP_NAME_
spec:
  selector:
    app: _APP_NAME_
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
