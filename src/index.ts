import * as express from 'express'
import * as webpack from 'webpack'
import * as path from 'path'
// @ts-ignore
import * as config from '../webpack.config'
import pdf from './pdf'

const app = express()
const compiler = webpack(config as any) as any
const isProduction = process.env.NODE_ENV === 'production'

app.get('/pdf', function (req, res) {
    res.setHeader('Content-Disposition', 'inline; filename="hello.pdf"')
    res.setHeader('Content-Type', 'application/pdf')
    pdf(res)
})

if(isProduction){
  app.use('/', express.static(compiler.outputPath));
} else {
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: false,
    publicPath: config.output.publicPath,
    stats: { colors: true }
  }));
  app.use(require('webpack-hot-middleware')(compiler));
  app.use('*', function (req, res, next) {
    var filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, function(err: any, result: string){
      if (err) {
        return next(err);
      }
      res.set('content-type','text/html');
      res.send(result);
      res.end();
    });
  });
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
